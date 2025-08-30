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

            if (geojson.features.length === 0) {
                throw {
                    cause: KnownErrorCauses.InvalidGeometry,
                    message: "No points in geometry"
                }
            }

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
