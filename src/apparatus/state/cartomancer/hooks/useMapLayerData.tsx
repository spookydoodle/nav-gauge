import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useStateWarden, FeatureStateProps } from "@apparatus";

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
    options?: MapLayerHandlerOptions;
}

export interface MapLayerHandlerOptions {
    /**
     * Buffer around cursor in pixels for feature detection. Defaults to 4px.
     */
    buffer?: number;
}

export const useMapLayerData = (
    sources: { [key in string]: maplibregl.SourceSpecification },
    layers: maplibregl.LayerSpecification[],
    handlers?: MapDataHandlers,
    /**
     * Tuple [sourceId, featureIds]
     */
    highlightIds: [string, Set<(string | number)>][] = []
) => {
    const { cartomancer } = useStateWarden();
    const { map } = cartomancer;
    const { buffer = 4 } = handlers?.options ?? {};

    useEffect(() => {
        console.log("add", sources)
        cartomancer.addSourcesAndLayers(sources, layers)

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
            console.log("remove", sources)
            cartomancer.clearLayersAndSources(
                layers.map((layer) => layer.id),
                Object.keys(sources)
            );
        };
    }, [map, sources, layers, handlers, buffer]);

    useEffect(() => {
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
