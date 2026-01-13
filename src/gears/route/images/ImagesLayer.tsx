import { FC, useEffect, useMemo, useState } from "react";
import maplibregl from "maplibre-gl";
import { LoadedImageData, OverlayComponentProps, useMapImages, useStateWarden, IMAGE_SIZE, Cartomancer, useGaugeContext, FeatureStateProps, useMapLayerData, useSubjectState, MapDataHandlers } from "@apparatus";
import { useLoadedImages } from "../hooks/useLoadedImages";
import { sourceIds, getImagesLayers, ImageFeature, ImageFeatureProperties, layerIds, DEFAULT_IMAGE_SIZE, getInDisplayImageLayer } from '../layers';
import { getImageIconSize } from "../tinkers";

const getId = (image: LoadedImageData): string => `image-${image.id}`;

export const ImagesLayer: FC<OverlayComponentProps> = ({
    geojson,
    images,
    onUpdateImageFeatureId,
}) => {
    const { theme } = useGaugeContext();
    const { cartomancer, animatrix } = useStateWarden();
    const { map } = cartomancer;
    const loadedImages = useLoadedImages(images);
    const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);

    useMapImages(loadedImages.filter((image) => !!image.bitmap).map((image) => ({
        icon: image.bitmap,
        name: getId(image),
        options: {
            width: IMAGE_SIZE,
            height: IMAGE_SIZE
        }
    })))

    const sourceDataGeojson = useMemo((): GeoJSON.FeatureCollection<GeoJSON.Point, ImageFeatureProperties> => ({
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
    }), [loadedImages, geojson]);

    const sources = useMemo((): { [key in string]: maplibregl.SourceSpecification } => ({
        [sourceIds.image]: {
            type: "geojson",
            data: sourceDataGeojson,
            promoteId: 'imageId'
        }
    }), [sourceDataGeojson]);
    
    const layers = useMemo(() => getImagesLayers(theme), [theme]);

    const handlers = useMemo((): MapDataHandlers => ({
        onMouseMove: ({ features, isTopRelated }) => {
            if (!isTopRelated) {
                return;
            }
            setHighlightIds(new Set(features.map((f) => f.id?.toString() ?? '')));
        },
        onMouseDown: ({ features, isTopRelated }) => {
            if (!isTopRelated || features.length === 0) {
                return;
            }
            setDraggingId(features[0].properties.imageId);
        },
        onMouseUp: () => setDraggingId(null)
    }), []);

    useMapLayerData(sources, layers, handlers, [[sourceIds.image, highlightIds]])

    useEffect(() => {
        if (draggingId === null) {
            return
        }
        const update = (value: boolean) => {
            if (map.getSource(sourceIds.image)) {
                map.setFeatureState({ source: sourceIds.image, id: draggingId }, { [FeatureStateProps.Dragging]: value });
            }
        };
        update(true);

        return () => {
            update(false);
        };
    }, [draggingId]);

    useEffect(() => {
        if (draggingId === null) {
            return;
        }
        map.dragPan.disable();
        const handleDrag = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            event.preventDefault();
            const [_id, feature] = Cartomancer.getClosestFeature(geojson, event.lngLat);
            const image = loadedImages.find((image) => image.id === draggingId);
            const source = map.getSource(sourceIds.image) as maplibregl.GeoJSONSource | undefined;
            if (source && image) {
                source.setData({
                    ...sourceDataGeojson,
                    features: sourceDataGeojson.features.concat([{
                        type: 'Feature',
                        geometry: feature.geometry,
                        properties: {
                            imageId: -1,
                            image: getId(image)
                        }
                    }])
                });
            }
        };

        const handleDragEnd = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            event.preventDefault();
            const [id, _feature] = Cartomancer.getClosestFeature(geojson, event.lngLat);
            const image = loadedImages.find((image) => image.id === draggingId)
            if (image) {
                onUpdateImageFeatureId(image.id, id);
            }
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

    const isInDisplay = displayImageId !== null;

    const inDisplaySource = useMemo((): { [key in string]: maplibregl.SourceSpecification } => {
        const image = loadedImages.find((image) => image.id === displayImageId);
        const feature = geojson.features.find((f) => f.properties.id === image?.featureId);
        console.log("indi")
        return {
            [sourceIds.imageInDisplay]: {
                type: 'geojson',
                data: image && feature ? {
                    type: 'Feature',
                    geometry: feature.geometry,
                    properties: {
                        imageId: image.id,
                        image: getId(image)
                    }
                } : { type: 'FeatureCollection', features: [] }
            }
        };
    }, [displayImageId, loadedImages]);

    const inDisplayLayers = useMemo(() => [getInDisplayImageLayer()], [])

    useMapLayerData(inDisplaySource, inDisplayLayers);

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
