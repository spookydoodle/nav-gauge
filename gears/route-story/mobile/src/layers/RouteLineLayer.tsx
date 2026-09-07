import { FC } from "react";
import { GeoJSONSource } from "@maplibre/maplibre-react-native";
import {
    getRouteLineLayers,
    getRoutePointsLayers,
    RouteStoryState,
    routeSourceIds,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { renderLayerSpec } from "./render-layer-spec";

interface Props {
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteLineLayer: FC<Props> = ({ source, state }) => (
    <GeoJSONSource
        id={routeSourceIds.line}
        data={source}
    >
        {getRouteLineLayers(state).map(renderLayerSpec)}
        {getRoutePointsLayers(state).map(renderLayerSpec)}
    </GeoJSONSource>
);