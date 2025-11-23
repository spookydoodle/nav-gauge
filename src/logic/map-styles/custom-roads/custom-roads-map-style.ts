import { MapStyle } from "../model";
import customRoadsStyle from "./custom-roads.json";

export const customRoadsMapStyle: MapStyle = {
    label: 'Custom roads',
    style: customRoadsStyle,
    attribution: {
        text: "Overture Maps",
        href: "https://docs.overturemaps.org/attribution"
    }
};
