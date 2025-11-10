import { useState } from "react";
import maplibregl from "maplibre-gl";
import turfDistance from "@turf/distance";
import * as turfHelpers from "@turf/helpers";
import { GeoJson, ImageData, parseImage } from "../logic/parsers";
import { RouteTimes } from "../nav-gauge/layers/RouteLayer";

export const useImageReader = (
    geojson?: GeoJson,
    routeTimes?: RouteTimes
): [ImageData[], (file: File) => void] => {
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

                const [featureId] = !geojson || !lngLat
                    ? []
                    : geojson.features.reduce<[number, number]>((acc, val) => {
                        const from = turfHelpers.point([lngLat.lng, lngLat.lat]);
                        const to = turfHelpers.point(val.geometry.coordinates);
                        const distance = turfDistance(from, to, { units: 'meters' });

                        return distance < acc[1] ? [val.properties.id, distance] : acc;
                    }, [0, Infinity]);

            const feature = (geojson?.features ?? []).find((feature) => feature.properties.id === featureId);

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
                    nextImages[index].marker = new maplibregl.Marker({ element: markerElement, }).setLngLat(featureLngLat);
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

    return [images, readImage];
};
