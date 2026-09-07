import { FC } from "react";
import { GeoJSONSource } from "@maplibre/maplibre-react-native";
import {
    getCurrentPointLayers,
    RouteStoryState,
    routeSourceIds,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { renderLayerSpec } from "./render-layer-spec";

interface Props {
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteCurrentPointLayer: FC<Props> = ({ source, state }) => {
    return (
        <GeoJSONSource
            id={routeSourceIds.currentPoint}
            data={source}
        >
            {getCurrentPointLayers(state).map(renderLayerSpec)}
        </GeoJSONSource>
    );
};