export enum FeatureStateProps {
    Highlight = 'highlight',
    Dragging = 'dragging',
}

export interface CurrentPointData {
    line: GeoJSON.GeoJSON;
    currentPoint: GeoJSON.Feature<GeoJSON.Point>;
    splitIndex: number;
    fraction: number;
    heading: number;
}
