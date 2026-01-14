import { FC, useEffect, useMemo } from "react";
import {
    LoadedImageData,
    useStateWarden,
    IMAGE_SIZE,
    useMapLayerData,
    useSubjectState,
    MapLayerData,
    GeoJson
} from "@apparatus";
import {
    sourceIds,
    layerIds,
    DEFAULT_IMAGE_SIZE,
    getDisplayImageLayers,
    ImageFeatureProperties
} from '../layers';
import { getImageIconSize, getIconImageId, emptyCollection } from "../tinkers";

const ANIMATION_DURATION = 250;

const getData = (
    geojson: GeoJson,
    loadedImages: LoadedImageData[],
    displayImageId: number | null
): GeoJSON.GeoJSON => {
    const image = loadedImages.find((image) => image.id === displayImageId);
    if (!image) {
        return emptyCollection;
    }

    const geometry = geojson.features.find((f) => f.properties.id === image.featureId)?.geometry;
    if (!geometry) {
        return emptyCollection;
    }

    const properties: ImageFeatureProperties = {
        imageId: image.id,
        iconImageId: getIconImageId(image)
    };

    return {
        type: 'Feature',
        geometry,
        properties
    };
};

interface Props {
    geojson: GeoJson;
    loadedImages: LoadedImageData[];
}

export const DisplayImageLayer: FC<Props> = ({
    geojson,
    loadedImages,
}) => {
    const { cartomancer, animatrix } = useStateWarden();
    const { map } = cartomancer;
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const isInDisplay = displayImageId !== null;

    const mapLayerData = useMemo((): MapLayerData => {
        return {
            sources: {
                [sourceIds.imageInDisplay]: {
                    type: 'geojson',
                    data: getData(geojson, loadedImages, displayImageId)
                }
            },
            layers: getDisplayImageLayers()
        };
    }, [])

    const updateData = useMemo(
        (): [string, GeoJSON.GeoJSON, number | undefined] => [
            sourceIds.imageInDisplay, 
            getData(geojson, loadedImages, displayImageId),
            displayImageId === null ? ANIMATION_DURATION : undefined
        ],
        [geojson, loadedImages, displayImageId]
    );

    useMapLayerData(mapLayerData, [], updateData);

    useEffect(() => {
        function easeInOut(t: number) {
            return t < 0.5
                ? 2 * t * t
                : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }

        function animateIconSize(
            from: number,
            to: number,
            onFinish?: () => void,
        ): void {
            const start = performance.now();

            const frame = (now: number) => {
                const progress = Math.min((now - start) / ANIMATION_DURATION, 1);
                const value = from + (to - from) * easeInOut(progress);

                if (map.getLayer(layerIds.imageInDisplay)) {
                    map.setLayoutProperty(layerIds.imageInDisplay, 'icon-size', value);
                }

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    onFinish?.();
                }
            };

            requestAnimationFrame(frame);
        }

        const canvas = map.getCanvas();
        const from = getImageIconSize(IMAGE_SIZE, DEFAULT_IMAGE_SIZE);
        const to = getImageIconSize(IMAGE_SIZE, Math.min(canvas.width, canvas.height)) / 2;

        if (isInDisplay) {
            animateIconSize(from, to);
        } else {
            animateIconSize(to, from);
        }
    }, [isInDisplay]);

    return null;
};
