import { FileToGeoJSONParser } from './file-parser';
import { ParsingResult } from './model';

export class GeoJsonParser extends FileToGeoJSONParser {
    public acceptedFileExtensions = [".geojson"];

    public rawText = async (file: File): Promise<string> => {
        return file.text();
    };

    public parseTextToGeoJson = (text: string): ParsingResult => {
        const result = JSON.parse(text);
        return {
            geojson: result as GeoJSON.GeoJSON,
        };
    };
}
