import { gpx } from '@tmcw/togeojson';
import { FileToGeoJSONParser } from './file-parser';
import { ParsingResult } from './model';

export class GpxParser extends FileToGeoJSONParser {
    public acceptedFileExtensions = [".gpx"];
    private nameMetadataSelector = "metadata > name";

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
