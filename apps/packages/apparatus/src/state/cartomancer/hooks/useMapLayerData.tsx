import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useStateWarden, FeatureStateProps } from "@apparatus";
import { useUpdateSourceData } from "./useUpdateData";
import { emptyCollection } from "../../../../../gears/src";

const DEFAULT_BUFFER = 4;

export interface MapLayerData {
    sources: { [key in string]: maplibregl.SourceSpecification };
    /**
     * Tuples [layer specification, before id]
     */
    layers: maplibregl.LayerSpecification[];
    beforeLayerId?: string;
    handlers?: MapDataHandlers;
}

export interface MapLayerHandlerData {
    features: maplibregl.MapGeoJSONFeature[];
    allFeatures: maplibregl.MapGeoJSONFeature[];
    isTopRelated: boolean;
}

export interface MapDataHandlers {
    onMouseMove?: (data: MapLayerHandlerData, event: maplibregl.MapMouseEvent) => void,
    onMouseDown?: (data: MapLayerHandlerData, event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => void,
    onMouseUp?: (data: MapLayerHandlerData, event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => void,
    onClick?: (data: MapLayerHandlerData, event: maplibregl.MapMouseEvent) => void,
    options?: {
        /**
         * Buffer around cursor in pixels for feature detection. Defaults to 4px.
         */
        buffer?: number;
    };
}

/**
 * @param data Sources, layers and event handlers. When this dependency changes, layers will be removed and added again.
 * @param highlightIds Tuple `[sourceId, featureIds]` to apply highlight feature state to.
 * @param updatedData Tuple `[sourceId, data, delay in ms (optional)]` Changes to this dependency will trigger `source.setData` event (without removing the layers and sources).
 */
export const useMapLayerData = (
    data: MapLayerData,
    highlightIds: [string, Set<(string | number)>][] = [],
    updatedData?: [string, GeoJSON.GeoJSON, number | undefined]
) => {
    const { cartomancer } = useStateWarden();
    const { map } = cartomancer;

    useEffect(() => {
        const { sources, layers, beforeLayerId, handlers } = data;
        const { buffer = DEFAULT_BUFFER } = data.handlers?.options ?? {};
        cartomancer.addSourcesAndLayers(sources, layers, beforeLayerId)

        const queryFeatures = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent): {
            features: maplibregl.MapGeoJSONFeature[];
            allFeatures: maplibregl.MapGeoJSONFeature[];
            isTopRelated: boolean;
        } => {
            const layerIds = layers.map((layer) => layer.id);
            const allFeatures = map.queryRenderedFeatures([
                [event.point.x - buffer, event.point.y - buffer],
                [event.point.x + buffer, event.point.y + buffer],
            ]);

            if (allFeatures.every((feature) => !layerIds.includes(feature.layer.id))) {
                return { features: [], allFeatures: [], isTopRelated: false };
            }

            return {
                features: allFeatures.filter((feature) => layerIds.includes(feature.layer.id)),
                allFeatures,
                isTopRelated: !!allFeatures[0] && layerIds.includes(allFeatures[0].layer.id)
            };
        };

        const mouseMoveHandler = (event: maplibregl.MapMouseEvent) => {
            handlers?.onMouseMove?.(queryFeatures(event), event);
        };

        const mouseDownHandler = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            handlers?.onMouseDown?.(queryFeatures(event), event);
        };

        const mouseUpHandler = (event: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent) => {
            handlers?.onMouseUp?.(queryFeatures(event), event)
        };

        const clickHandler = (event: maplibregl.MapMouseEvent) => {
            handlers?.onClick?.(queryFeatures(event), event)
        };

        map.on('click', clickHandler);

        map.on('mousemove', mouseMoveHandler);

        map.on('mousedown', mouseDownHandler);
        map.on('mouseup', mouseUpHandler);

        map.on('touchstart', mouseDownHandler);
        map.on('touchend', mouseUpHandler);

        return () => {
            map.off('click', clickHandler);

            map.off('mousemove', mouseMoveHandler);

            map.off('mousedown', mouseDownHandler);
            map.off('mouseup', mouseUpHandler);

            map.off('touchstart', mouseDownHandler);
            map.off('touchend', mouseUpHandler);

            cartomancer.clearLayersAndSources(layers, sources);
        };
    }, [map, data]);

    useUpdateSourceData(updatedData?.[0] ?? '', updatedData?.[1] ?? emptyCollection, updatedData?.[2]);

    useEffect(() => {
        if (highlightIds.length === 0) {
            return;
        }
        const update = (value: boolean) => {
            for (const [source, featureIds] of highlightIds) {
                cartomancer.updateFeatureState(source, featureIds, FeatureStateProps.Highlight, value)
            }
        };

        update(true);

        return () => {
            update(false);
        };
    }, [highlightIds]);

    return null;
};
