import { useState } from "react";
import maplibregl from "maplibre-gl";
import { GeoJson, getClosestFeature, ImageData, parseImage } from "../logic";

type ImageReaderResult = [
    ImageData[],
    (file: File) => void,
    (imageId: number, featureId: number) => void
]

export const useImageReader = (
    geojson?: GeoJson
): ImageReaderResult => {
    const [images, setImages] = useState<ImageData[]>([]);

    const readImage = (file: File) => {
        const reader = new FileReader();

        const getNext = (ids: number[]) => {
            let i = 0;
            while (ids.includes(i)) {
                i++;
            }
            return i;
        };

        reader.onloadstart = () => {
            setImages((prev) => prev.filter((el) => el.name !== file.name).concat({
                id: getNext(prev.map((el) => el.id)),
                name: file.name,
                progress: 0
            }));
        };

        reader.onprogress = (e) => {
            setImages((prev) => {
                const nextImages = prev.slice();
                const index = prev.findIndex((el) => el.name === file.name);
                nextImages[index] = { ...nextImages[index], progress: Number((e.loaded / e.total * 100).toFixed(0)) };

                return nextImages;
            });
        };

        reader.onload = async (e) => {
            const { data, exif, lngLat, error } = await parseImage(file, e);
            setImages((prev) => {
                const nextImages = prev.slice();
                const index = prev.findIndex((el) => el.name === file.name);

                const [featureId, feature] = geojson && lngLat ? getClosestFeature(lngLat, geojson) : [];

                nextImages[index] = {
                    ...nextImages[index],
                    progress: 100,
                    lngLat,
                    data,
                    exif,
                    error,
                    featureId,
                };

                if (feature) {
                    const markerElement = document.createElement('div');
                    markerElement.classList.add("test-marker-to-remove"); // TODO: Remove this;
                    const featureLngLat = new maplibregl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);

                    nextImages[index].markerElement = markerElement;
                    nextImages[index].marker = new maplibregl.Marker({
                        element: markerElement,
                        draggable: true,
                    }).setLngLat(featureLngLat);
                }

                return nextImages;
            });
        };

        reader.onerror = (e) => {
            setImages((prev) => {
                const nextImages = prev.slice();
                const index = prev.findIndex((el) => el.name === file.name);
                nextImages[index] = { ...nextImages[index], error: e.target?.error?.message ?? 'Cannot read file' };

                return nextImages;
            });
        };

        reader.readAsDataURL(file);
    };

    const updateImageFeatureId = (imageId: number, featureId: number) => {
        setImages((prev) => prev.map((im) => im.id === imageId ? { ...im, featureId } : im))
    };

    return [images, readImage, updateImageFeatureId];
};
