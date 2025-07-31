import { gpx } from '@tmcw/togeojson';

export class GpxParser {
    public fileType = ".gpx";
    private nameMetadataSelector = "metadata > name";

    /**
     * Parses `.gpx` file to GeoJSON format.
     * @param file File to parse
     * @returns A tuple where the first element is the GeoJSON and second the name extracted from file metadata.
     */
    public parseGpxFile = async (file: File): Promise<[GeoJSON.FeatureCollection, string | undefined]> => {
        const text = await this.rawText(file);
        return this.parseTextToGeoJson(text);
    };

    /**
     * Extracts raw text from a `.gpx` file.
     * @param file File to extract text from.
     * @returns GPX data as raw text.
     */
    public rawText = async (file: File): Promise<string> => {
        if (!file.name.endsWith(this.fileType)) {
            throw new Error("Unexpected file type.");
        }
        return file.text();
    };

    /**
     * Parses text received from reading a `.gpx` file to GeoJSON format.
     * @param text Text to parse
     * @returns A tuple where the first element is the GeoJSON and second the name extracted from file metadata.
     */
    public parseTextToGeoJson = (text: string): [GeoJSON.FeatureCollection, string | undefined] => {
        const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
        const geojson = gpx(xmlDoc);

        return [geojson, xmlDoc.querySelector(this.nameMetadataSelector)?.textContent ?? undefined]
    };
}
