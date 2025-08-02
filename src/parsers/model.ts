export interface ParsingResult {
    routeName?: string;
    geojson?: GeoJSON.FeatureCollection;
    error?: Error;
}
