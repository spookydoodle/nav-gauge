import { AttributionEntry } from "../../model";

export interface MapStyle {
    label: string;
    style: string | maplibregl.StyleSpecification;
    attribution?: AttributionEntry;
}
