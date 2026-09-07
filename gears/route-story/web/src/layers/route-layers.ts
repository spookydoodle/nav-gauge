import * as maplibregl from "maplibre-gl";
import {
    getCameraLineLayers,
    getCurrentPointLayers,
    getRouteLineLayers,
    getRoutePointsLayers,
    RouteStoryState,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const getWebRouteLineLayers = (state: RouteStoryState): maplibregl.LayerSpecification[] =>
    getRouteLineLayers(state);

export const getWebRoutePointsLayers = (state: RouteStoryState): maplibregl.LayerSpecification[] =>
    getRoutePointsLayers(state);

export const getWebCurrentPointLayers = (state: RouteStoryState): maplibregl.LayerSpecification[] =>
    getCurrentPointLayers(state);

export const cameraLineLayers = getCameraLineLayers();