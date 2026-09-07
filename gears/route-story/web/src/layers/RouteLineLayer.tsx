import { FC, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { layerOrder, routeSourceIds, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { getWebRouteLineLayers, getWebRoutePointsLayers } from "./route-layers";

interface Props {
    map: maplibregl.Map;
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteLineLayer: FC<Props> = ({
    map,
    source,
    state,
}) => {
    const mapLayerData = useMemo((): MapLayerData => {
        const routeLayers: MapLayerData['layers'] = [];

        if (state.routeStyleActive.showRouteLine || state.routeStyleInactive.showRouteLine) {
            routeLayers.push(...getWebRouteLineLayers(state));
        }
        if (state.routeStyleActive.showRoutePoints || state.routeStyleInactive.showRoutePoints) {
            routeLayers.push(...getWebRoutePointsLayers(state));
        }

        return {
            sourceId: routeSourceIds.line,
            source: {
                type: 'geojson',
                data: source,
                promoteId: 'id'
            },
            layers: routeLayers,
        };
    }, [source, state]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            layerOrder={layerOrder}
        />
    );
};