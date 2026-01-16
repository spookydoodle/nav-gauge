export enum FeatureStateProps {
    Highlight = 'highlight',
    Dragging = 'dragging',
}

export interface CurrentPointData {
    lines: GeoJSON.GeoJSON;
    currentPoint: GeoJSON.Feature<GeoJSON.Point>;
    currentPointBearing: number;
    currentPointSpeed: number;
}
