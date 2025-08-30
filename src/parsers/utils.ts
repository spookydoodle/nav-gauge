import { FeatureProperties, KnownErrorCauses } from "./model";

export const getUnsupportedGeometryError = (unsupportedGeometry: string) => ({
    cause: KnownErrorCauses.UnsupportedGeometry,
    message: `${unsupportedGeometry} geometry is not supported. Upload a file with a LineString geometry or Point features.`
});

export const getMissingTimeInformationError = () => ({
    cause: KnownErrorCauses.MissingTimeInformation,
    message: 'File does not contain time information.'
});

export const createFeature = (
    position: GeoJSON.Position,
    properties: FeatureProperties
): GeoJSON.Feature<GeoJSON.Point, FeatureProperties> => ({
    type: 'Feature',
    id: properties.id,
    geometry: {
        type: 'Point',
        coordinates: position,
    },
    properties
});
