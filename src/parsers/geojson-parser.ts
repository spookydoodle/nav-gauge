import { } from '@tmcw/togeojson';
import { FileToGeoJSONParser } from './file-parser';
import { ParsingResult } from './model';

export class GeoJsonParser implements FileToGeoJSONParser {
    public acceptedFileExtensions = [".geojson"];

    public parseFile = async (file: File): Promise<ParsingResult> => {
        const text = await this.rawText(file);
        return this.parseTextToGeoJson(text);
    };

    public rawText = async (file: File): Promise<string> => {
        return file.text();
    };

    public parseTextToGeoJson = (text: string): ParsingResult => {
        return {
            geojson: JSON.parse(text) as GeoJSON.FeatureCollection,
        };
    };
}
