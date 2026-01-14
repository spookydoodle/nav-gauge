import { FC, useEffect, useMemo, useState } from "react";
import maplibregl from "maplibre-gl";
import {
    OverlayComponentProps,
    useMapImages,
    useStateWarden,
    IMAGE_SIZE,
    Cartomancer,
    useGaugeContext,
    FeatureStateProps,
    useMapLayerData,
    MapLayerData
} from "@apparatus";
import { useLoadedImages } from "../hooks/useLoadedImages";
import {
    sourceIds,
    getImagesLayers,
    ImageFeature,
    ImageFeatureProperties,
    layerIds,
} from '../layers';
import { DisplayImageLayer } from "./DisplayImageLayer";
import { getIconImageId } from "../tinkers";

export const ImagesLayer: FC<OverlayComponentProps> = ({
    geojson,
    images,
    onUpdateImageFeatureId,
}) => {
    const { theme } = useGaugeContext();
    const { cartomancer } = useStateWarden();
    const { map } = cartomancer;
    const loadedImages = useLoadedImages(images);
    const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
    const [draggingId, setDraggingId] = useState<number | null>(null);

    useMapImages(loadedImages.filter((image) => !!image.bitmap).map((image) => ({
        icon: image.bitmap,
        iconImageId: getIconImageId(image),
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
                        iconImageId: getIconImageId(image)
                    }
                });
            }
            return acc;
        }, [])
    }), [loadedImages, geojson]);

    // Use set data on dependency change - do not remove/add layer
    const mapLayerData = useMemo((): MapLayerData => {
        return {
            sources: {
                [sourceIds.image]: {
                    type: "geojson",
                    data: sourceDataGeojson,
                    promoteId: 'imageId'
                }
            },
            layers: getImagesLayers(theme),
            beforeLayerId: layerIds.imageInDisplay,
            handlers: {
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
            },
        };
    }, [theme, sourceDataGeojson]);

    useMapLayerData(mapLayerData, [[sourceIds.image, highlightIds]]);

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
                            iconImageId: getIconImageId(image)
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

    return <DisplayImageLayer geojson={geojson} loadedImages={loadedImages} />;
};
