import { kml } from '@tmcw/togeojson';
import { FileToGeoJSONParser } from './file-parser';
import { ParsingResult } from './model';
import { createFeature, getMissingTimeInformationError, getUnsupportedGeometryError } from './utils';

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

        const unsupportedFeature = geojson.features.find((feature) => feature.geometry?.type !== 'Point')
        if (unsupportedFeature) {
            throw getUnsupportedGeometryError(unsupportedFeature.geometry?.type ?? 'None');
        }

        geojson.features = geojson.features.filter((f) => !!f.properties?.timespan?.begin);

        if (geojson.features.length === 0) {
            throw getMissingTimeInformationError();
        }

        return {
            geojson: {
                type: 'FeatureCollection',
                features: (geojson.features as GeoJSON.Feature<GeoJSON.Point>[]).map((f, i) =>
                    createFeature(f.geometry.coordinates, { id: i, time: f.properties!.timespan.begin })
                )
            },
            routeName: xmlDoc.querySelector(this.nameMetadataSelector)?.textContent ?? undefined,
        };
    };
}
