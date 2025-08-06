export interface ParsingResult {
    routeName?: string;
    geojson: GeoJSON.FeatureCollection<GeoJSON.Point, FeatureProperties>;
}

export interface ParsingResultWithError {
    routeName?: string;
    geojson?: GeoJSON.FeatureCollection<GeoJSON.Point, FeatureProperties>;
    boundingBox?: GeoJSON.BBox;
    error?: Error;
}

export interface FeatureProperties {
    id: number;
    time: string;
}

export enum KnownErrorCauses {
    InvalidGeometry = "Invalid Geometry",
    UnsupportedGeometry = "Unsupported Geometry",
    MissingTimeInformation = 'Missing Time Information'
}
