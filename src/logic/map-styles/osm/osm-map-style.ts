import { MapStyle } from "../model";
import osmStyle from "./osm.json";

export const osmMapStyle: MapStyle = {
    name: 'OpenStreetMap',
    style: osmStyle,
    attribution: {
        text: "OpenStreetMap",
        href: "https://openstreetmap.org/copyright"
    }
};
