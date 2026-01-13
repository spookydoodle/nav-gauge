import { FC, useEffect, useState } from "react";
import { LoadedImageData, OverlayComponentProps, useMapImages, useStateWarden, IMAGE_SIZE, Cartomancer, useGaugeContext, FeatureStateProps } from "@apparatus";
import { useLoadedImages } from "../hooks/useLoadedImages";
import { sourceIds, layerIds, getImagesLayers, ImageFeature } from '../layers';

const getId = (image: LoadedImageData): string => `image-${image.id}`;

export const ImagesLayer: FC<OverlayComponentProps> = ({
    geojson,
    images,
    onProgressMsChange,
    onUpdateImageFeatureId,
    progressMs,
    routeTimes,
}) => {
    const { theme } = useGaugeContext();
    const { cartomancer } = useStateWarden();
    const { map } = cartomancer;
    const loadedImages = useLoadedImages(images);
    const [highlightIds, setHighlightIds] = useState<string[]>([]);
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [closestFeatureId, setClosestFeatureId] = useState<number | null>(null);

    useMapImages(loadedImages.filter((image) => !!image.bitmap).map((image) => ({
        icon: image.bitmap,
        name: getId(image),
        options: {
            width: IMAGE_SIZE,
            height: IMAGE_SIZE
        }
    })))

    useEffect(() => {
        map.addSource(sourceIds.image, {
            type: "geojson",
            data: {
                type: 'FeatureCollection',
                features: loadedImages.reduce<ImageFeature[]>((acc, image) => {
                    const feature = geojson.features.find((f) => f.properties.id === image.featureId);
                    if (feature) {
                        acc.push({
                            type: 'Feature',
                            geometry: feature.geometry,
                            properties: {
                                imageId: image.id,
                                image: getId(image)
                            }
                        });
                    }
                    return acc;
                }, [])
            },
            promoteId: 'image'
        });

        const layers = getImagesLayers(theme);
        for (const layer of layers) {
            map.addLayer(layer);
        }

        const queryFeatures = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent, onlyTop = false) => {
            const buffer = 4;
            const allFeatures = map.queryRenderedFeatures([
                [event.point.x - buffer, event.point.y - buffer],
                [event.point.x + buffer, event.point.y + buffer],
            ]);

            const isTopFeatureFromLayers: boolean = !!allFeatures[0] && layers.map((layer) => layer.id).includes(allFeatures[0].layer.id);
            if (onlyTop && !isTopFeatureFromLayers) {
                return [];
            }

            return allFeatures.filter((feature) => feature.layer.id === layerIds.images);
        };

        const mouseMoveHandler = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            setHighlightIds(queryFeatures(event).map((f) => f.id?.toString() ?? ''));
        };

        const mouseDownHandler = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            const features = queryFeatures(event, true) as unknown as ImageFeature[];
            if (features.length > 0) {
                setDraggingId(features[0].properties.imageId)
            }
        };

        const releaseHandler = () => {
            setDraggingId(null);
        };

        map.on('mousemove', mouseMoveHandler);

        map.on('mousedown', mouseDownHandler);
        map.on('mouseup', releaseHandler);

        map.on('touchstart', mouseDownHandler);
        map.on('touchend', releaseHandler);

        return () => {
            map.off('mousemove', mouseMoveHandler);

            map.off('mousedown', mouseDownHandler);
            map.off('mouseup', releaseHandler);

            map.off('touchstart', mouseDownHandler);
            map.off('touchend', releaseHandler);

            for (const layer of layers) {
                map.removeLayer(layer.id);
            }
            map.removeSource(sourceIds.image);
        };
    }, [map, loadedImages, theme]);

    useEffect(() => {
        const update = (value: boolean) => {
            for (const id of highlightIds) {
                map.setFeatureState({ source: sourceIds.image, id }, { [FeatureStateProps.Highlight]: value });
            }
        };

        update(true);

        return () => {
            update(false)
        };
    }, [highlightIds]);

    useEffect(() => {
        const update = (value: boolean) => {
            for (const id of highlightIds) {
                map.setFeatureState({ source: sourceIds.image, id }, { [FeatureStateProps.Highlight]: value });
            }
        };

        update(true);

        return () => {
            update(false)
        };
    }, [highlightIds]);

    useEffect(() => {
        if (draggingId === null) {
            return;
        }
        map.dragPan.disable();
        const handleDrag = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            event.preventDefault();
            event.originalEvent.stopPropagation();
            setClosestFeatureId(Cartomancer.getClosestFeature(geojson, event.lngLat)[0]);
        };

        const handleDragEnd = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            event.preventDefault();
            const [id, feature] = Cartomancer.getClosestFeature(geojson, event.lngLat);
            // image.marker.setLngLat(new maplibregl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]));
            // TODO: setData
            const image = loadedImages.find((image) => image.id === draggingId)
            if (image) {
                onUpdateImageFeatureId(image.id, id);
            }

            setClosestFeatureId(null);
        };

        map.on('mousemove', handleDrag);
        map.on('mouseup', handleDragEnd);
        map.on('touchmove', handleDrag);
        map.on('touchend', handleDragEnd);

        return () => {
            map.off('mousemove', handleDrag);
            map.off('mouseup', handleDragEnd);
            map.off('touchmove', handleDrag);
            map.off('touchend', handleDragEnd);
            map.dragPan.enable();
        };
    }, [draggingId]);

    return null;
};
