import { MapStyle } from "../model";
import osmStyle from "./osm.json";

export const osmMapStyle: MapStyle = {
    label: 'OpenStreetMap',
    style: osmStyle,
    attribution: {
        text: "OpenStreetMap",
        href: "https://openstreetmap.org/copyright"
    }
};
