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
import { getImageIconSize, getIconImageId } from "../tinkers";

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

    // Use set data on dependency change - do not remove/add layer
    const imageDisplayMapLayerData = useMemo((): MapLayerData => {
        const image = loadedImages.find((image) => image.id === displayImageId);
        const feature = geojson.features.find((f) => f.properties.id === image?.featureId);
        const properties: ImageFeatureProperties | undefined = image ? {
            imageId: image.id,
            iconImageId: getIconImageId(image)
        } : undefined;

        return {
            sources: {
                [sourceIds.imageInDisplay]: {
                    type: 'geojson',
                    data: feature && properties ? {
                        type: 'Feature',
                        geometry: feature.geometry,
                        properties
                    } : { type: 'FeatureCollection', features: [] }
                }
            },
            layers: getDisplayImageLayers()
        };
    }, [])

    useMapLayerData(imageDisplayMapLayerData);

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
            const duration = 250;
            const start = performance.now();

            const frame = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);
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
