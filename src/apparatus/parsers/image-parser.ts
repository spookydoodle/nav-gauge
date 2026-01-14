import maplibregl from "maplibre-gl";
import EXIF from 'exif-js';

export interface ExifData {
    /**
     * @example YYYY:MM:DD HH:mm:ss local
     */
    DateTime?: string;
    /**
     * @example YYYY:MM:DD HH:mm:ss local
     */
    DateTimeOriginal?: string;
    /**
     * @example YYYY:MM:DD HH:mm:ss local
     */
    DateTimeDigitized?: string;
    /**
     * @example YYYY:MM:DD local
     */
    GPSDateStamp?: string;
    GPSDestBearing?: { denominator: number; numerator: number };
    GPSDestBearingRef?: string;
    GPSLongitude?: [number, number, number];
    GPSLongitudeRef?: 'E' | 'W';
    GPSLatitude?: [number, number, number];
    GPSLatitudeRef?: 'N' | 'S';
}

export interface MarkerImage {
    id: number;
    name: string;
    progress: number;
    lngLat?: maplibregl.LngLat;
    data?: string;
    bitmap?: ImageBitmap;
    exif?: ExifData;
    error?: string;
    featureId?: number;
    markerElement?: HTMLDivElement;
    marker?: maplibregl.Marker;
}

export interface LoadedImageData extends Omit<MarkerImage, 'progress' | 'error' | 'featureId' | 'data' | 'lngLat'> {
    lngLat: maplibregl.LngLat;
    featureId: number;
    data: string;
    bitmap: ImageBitmap;
}

export const IMAGE_SIZE = 800;

export const parseImage = async (
    file: File,
    e: ProgressEvent<FileReader>
): Promise<{
    data?: string;
    bitmap?: ImageBitmap;
    exif?: ExifData;
    error?: string;
    lngLat?: maplibregl.LngLat;
}> => {
    const buffer = await file.arrayBuffer();
    const exif = EXIF.readFromBinaryFile(buffer) as false | ExifData;

    let bitmap: ImageBitmap | undefined;
    try {
        bitmap = await resizeImage(e.target?.result, {
            targetSize: IMAGE_SIZE,
            keepAspectRatio: false,
            shape: 'circle'
        });
    } catch (err) {
        console.error(err);
    }

    // TODO: Derive timezone
    return {
        data: e.target?.result?.toString(),
        bitmap,
        exif: exif || undefined,
        lngLat: getLngLat(exif || undefined),
        error: getError(exif),
    };
};

/**
 * @param e File progress event
 * @param size Defaults to 200px
 * @returns Resized image
 */
const resizeImage = (
    result?: FileReader['result'],
    options: {
        targetSize?: number;
        shape?: 'circle' | 'square',
        keepAspectRatio?: boolean,
    } = {}
): Promise<ImageBitmap> => {
    const {
        targetSize = 200,
        shape = 'square',
        keepAspectRatio = false
    } = options;

    return new Promise((resolve, reject) => {
        if (!result) {
            reject();
            return;
        }

        let img = new Image();

        img.onload = () => {
            const sourceSize = Math.min(img.width, img.height);
            const sourceX = (img.width - sourceSize) / 2;
            const sourceY = (img.height - sourceSize) / 2;
            let sourceWidth = sourceSize;
            let sourceHeight = sourceSize;
            let targetWidth = targetSize;
            let targetHeight = targetSize;

            if (keepAspectRatio) {
                sourceWidth = img.width;
                sourceHeight = img.height;
                const scale = Math.min(targetSize / img.width, targetSize / img.height, 1);
                targetWidth = img.width * scale;
                targetHeight = img.height * scale;
            }

            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d")!;

            if (shape === 'circle') {
                ctx.beginPath();
                ctx.arc(
                    targetWidth / 2,
                    targetHeight / 2,
                    Math.min(targetWidth, targetHeight) / 2,
                    0,
                    Math.PI * 2
                );
                ctx.closePath();
                ctx.clip();
            }

            ctx.drawImage(
                img,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                targetWidth,
                targetHeight
            );

            // resolve(canvas.toDataURL("image/jpeg", 0.8));
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject();
                    return;
                }
                createImageBitmap(blob).then(resolve);
            }, "image/png");
        };

        img.src = result.toString();
    });
};

const getLngLat = (exif?: ExifData): maplibregl.LngLat | undefined => {
    if (!exif) {
        return;
    }

    const { GPSLongitude, GPSLongitudeRef, GPSLatitude, GPSLatitudeRef } = exif;
    if (!GPSLongitude || !GPSLongitudeRef || !GPSLatitude || !GPSLatitudeRef || GPSLongitude.concat(GPSLatitude).some(isNaN)) {
        return;
    }

    return new maplibregl.LngLat(
        getLngLatValue(GPSLongitude, GPSLongitudeRef),
        getLngLatValue(GPSLatitude, GPSLatitudeRef)
    );
};

const getLngLatValue = ([deg, min, s]: [number, number, number], ref: 'N' | 'S' | 'W' | 'E') => {
    return (deg + min / 60 + s / 3600) * (ref === 'S' || ref === 'W' ? -1 : 1);
};

const getError = (exif: ExifData | false): string => {
    if (exif === false) {
        return 'Not valid EXIF data';
    }
    if ([exif.GPSLongitude, exif.GPSLongitudeRef, exif.GPSLatitude, exif.GPSLatitudeRef].some((el) => el === undefined)) {
        return 'No GPS coordinates in EXIF';
    }
    if ([exif.GPSLongitudeRef, exif.GPSLatitudeRef].some((el) => !['N', 'S', 'W', 'E'].includes(el as string))) {
        return 'Unprocessable GPS data in EXIF';
    }
    if (exif.GPSLongitude?.some((el) => isNaN(el)) || exif.GPSLatitude?.some((el) => isNaN(el))) {
        return 'Unprocessable GPS data in EXIF';
    }
    return "";
};
