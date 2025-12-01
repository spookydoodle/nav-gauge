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

export interface ImageData {
    id: number;
    name: string;
    progress: number;
    lngLat?: maplibregl.LngLat;
    data?: string;
    exif?: ExifData;
    error?: string;
    featureId?: number;
    markerElement?: HTMLDivElement;
    marker?: maplibregl.Marker;
}

export interface LoadedImageData extends Omit<ImageData, 'progress' | 'error' | 'featureId' | 'data' | 'lngLat'> {
    lngLat: maplibregl.LngLat;
    featureId: number;
    data: string;
}

export const parseImage = async (file: File, e: ProgressEvent<FileReader>): Promise<{ data?: string; exif?: ExifData; error?: string; lngLat?: maplibregl.LngLat; }> => {
    const buffer = await file.arrayBuffer();
    const exif = EXIF.readFromBinaryFile(buffer) as false | ExifData;

    // TODO: Compress image stored in memory or use
    // TODO: Derive timezone
    return {
        data: e.target?.result?.toString(),
        exif: exif || undefined,
        lngLat: getLngLat(exif || undefined),
        error: getError(exif),
    };
};

const getLngLat = (exif?: ExifData): maplibregl.LngLat | undefined => {
    if (!exif) {
        return;
    }

    const { GPSLongitude, GPSLongitudeRef, GPSLatitude, GPSLatitudeRef } = exif;
    if (!GPSLongitude || !GPSLongitudeRef || !GPSLatitude || !GPSLatitudeRef) {
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
