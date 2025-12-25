import { AttributionEntry } from "../../attribution-vault";

export interface MapStyle {
    label: string;
    style: string | maplibregl.StyleSpecification;
    attribution?: AttributionEntry;
}
