import { gpx } from '@tmcw/togeojson';
import { FileToGeoJSONParser } from './file-parser';
import { ParsingResult } from './model';

export class GpxParser implements FileToGeoJSONParser {
    public acceptedFileExtensions = [".gpx"];
    private nameMetadataSelector = "metadata > name";

    public parseFile = async (file: File): Promise<ParsingResult> => {
        try {
            const text = await this.rawText(file);
            return this.parseTextToGeoJson(text);
        } catch (err) {
            return { error: err as Error }
        }
    };

    public rawText = async (file: File): Promise<string> => {
        return file.text();
    };

    public parseTextToGeoJson = (text: string): ParsingResult => {
        const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
        const geojson = gpx(xmlDoc);

        return {
            geojson,
            routeName: xmlDoc.querySelector(this.nameMetadataSelector)?.textContent ?? undefined,
        }
    };
}
