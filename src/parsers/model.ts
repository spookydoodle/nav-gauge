export interface ParsingResult {
    routeName?: string;
    geojson: GeoJSON.GeoJSON;
}

export interface ParsingResultWithError {
    routeName?: string;
    geojson?: GeoJSON.GeoJSON;
    boundingBox?: GeoJSON.BBox;
    error?: Error;
}

export enum KnownErrorCauses {
    InvalidGeometry = "Invalid Geometry",
    UnsupportedGeometry = "Unsupported Geometry",
}
