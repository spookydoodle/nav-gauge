import bbox from "@turf/bbox";
import { KnownErrorCauses, ParsingResult, ParsingResultWithError } from "./model";

export abstract class FileToGeoJSONParser {
    /**
     * @example `[".gpx"]`
     */
    public abstract acceptedFileExtensions: string[];

    /**
     * Extracts raw text from a given file.
     * @param file File to extract text from.
     * @returns Data as raw text.
     */
    public abstract rawText: (file: File) => Promise<string>;

    /**
     * Parses text received from reading a given file to GeoJSON format.
     * @param text Text to parse.
     * @returns GeoJSON, route name from metadata.
     * @throws Error if geometries are not valid lines or points.
     */
    public abstract parseTextToGeoJson: (text: string) => ParsingResult;

    /**
     * @returns File extension extracted from file name.
     */
    public static getFileExtension = (file: File): string => {
        return '.' + file.name.split('.').slice(-1)[0];
    }

    /**
     * Parses given file to GeoJSON format and captures the error and passes it in the `error` property.
     * @param file File to parse.
     * @returns Route name from metadata, GeoJSON, Bounding box and/or error (if processing failed).
     */
    public parse = async (file: File): Promise<ParsingResultWithError> => {
        try {
            const text = await this.rawText(file);
            const { geojson, routeName } = await this.parseTextToGeoJson(text);
            const boundingBox = bbox(geojson);

            if (Array.from(boundingBox).some((n) => n === Infinity || n === -Infinity)) {
                throw {
                    cause: KnownErrorCauses.InvalidGeometry,
                    message: "Could not create a bounding box out of coordinates.",
                };
            }
            
            if (Array.from(boundingBox).some((n) => isNaN(n))) {
                throw {
                    cause: KnownErrorCauses.InvalidGeometry,
                    message: "Bounding box coordinates are not numbers.",
                };
            }

            const getUnsupportedGeometryError = (unsupportedGeometry: string) => ({
                cause: KnownErrorCauses.UnsupportedGeometry,
                message: `${unsupportedGeometry} geometry is not supported. Upload a file with a LineString geometry or Point features.`
            })

            switch (geojson.type) {
                case 'GeometryCollection': {
                    const unsupportedType = geojson.geometries.find((geometry) => geometry.type !== 'Point' && geometry.type !== 'LineString')?.type;
                    if (unsupportedType) {
                        throw getUnsupportedGeometryError(unsupportedType);
                    }
                    break;
                }
                case 'FeatureCollection': {
                    const unsupportedType = geojson.features.find((feature) => feature.geometry.type !== 'Point' && feature.geometry.type !== 'LineString')?.geometry.type
                    if (unsupportedType) {
                        throw getUnsupportedGeometryError(unsupportedType);
                    }
                    break;
                }
                case 'Feature': {
                    if (geojson.geometry.type !== 'LineString') {
                        throw getUnsupportedGeometryError(geojson.geometry.type);
                    }
                    break;
                }
                case 'LineString':
                    break;
                default:
                    throw getUnsupportedGeometryError(geojson.type);
            }

            return {
                routeName,
                geojson,
                boundingBox,
            };
        } catch (err) {
            return {
                error: new Error((err as Error).message || 'Unknown error', { cause: err })
            }
        }
    };
}
