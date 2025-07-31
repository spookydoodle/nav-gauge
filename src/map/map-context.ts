import { createContext, } from "react";
import maplibregl from "maplibre-gl";
import { osmStyle } from "./style/osm";

export interface MapContext {
    map: maplibregl.Map;
    mapZoom: number;
}


export const createMaplibreMap = (): maplibregl.Map => new maplibregl.Map({
    container: document.createElement('div'),
    style: osmStyle,
    attributionControl: false,
    maxPitch: 80
});

export const MapContext = createContext<MapContext>({ map: createMaplibreMap(), mapZoom: 0 });
