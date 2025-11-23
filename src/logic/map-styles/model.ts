import { AttributionEntry } from "../state";

export interface MapStyle {
    name: string;
    style: string | maplibregl.StyleSpecification;
    attribution?: AttributionEntry;
}
