import { kml } from '@tmcw/togeojson';
import { FileToGeoJSONParser } from './file-parser';
import { ParsingResult } from './model';

export class KmlParser extends FileToGeoJSONParser {
    public acceptedFileExtensions = [".kml"];
    private nameMetadataSelector = "metadata > name";

    public rawText = async (file: File): Promise<string> => {
        return file.text();
    };

    public parseTextToGeoJson = (text: string): ParsingResult => {
        const prefix = /(\w+):kml xmlns/g.exec(text)?.[1];
        if (prefix) {
            text = text.replace(
                new RegExp(`xmlns:${prefix}="http://www.opengis.net/kml/2.2"`, "g"),
                'xmlns="http://www.opengis.net/kml/2.2"'
            );
        }
        const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
        const geojson = kml(xmlDoc);

        return {
            geojson: {
                type: 'FeatureCollection',
                features: geojson.features.filter((f) => !!f.geometry) as GeoJSON.Feature[]
            },
            routeName: xmlDoc.querySelector(this.nameMetadataSelector)?.textContent ?? undefined,
        };
    };
}
