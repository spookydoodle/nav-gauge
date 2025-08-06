import { gpx } from '@tmcw/togeojson';
import { FileToGeoJSONParser } from './file-parser';
import { KnownErrorCauses, ParsingResult } from './model';
import { createFeature, getMissingTimeInformationError, getUnsupportedGeometryError } from './utils';

export class GpxParser extends FileToGeoJSONParser {
    public acceptedFileExtensions = [".gpx"];
    private nameMetadataSelector = "metadata > name";

    public rawText = async (file: File): Promise<string> => {
        return file.text();
    };

    public parseTextToGeoJson = (text: string): ParsingResult => {
        const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
        const geojson = gpx(xmlDoc);

        const unsupportedType = geojson.features.find((feature) => feature.geometry.type !== 'LineString')?.geometry.type
        if (unsupportedType) {
            throw getUnsupportedGeometryError(unsupportedType);
        }
        if (geojson.features.some((f) =>
            !f.properties?.coordinateProperties?.times ||
            !Array.isArray(f.properties.coordinateProperties.times) ||
            (f.properties.coordinateProperties.times as unknown[]).some((el) => typeof el !== 'string')
        )) {
            throw getMissingTimeInformationError();
        }
        let id = 0;
        return {
            geojson: {
                type: 'FeatureCollection',
                features: (geojson as GeoJSON.FeatureCollection<GeoJSON.LineString>)
                    .features
                    .flatMap((f) => f.geometry.coordinates.map((c, i) =>
                        createFeature(c, { id: id++, time: (f.properties!.coordinateProperties.times as string[])[i] })
                    ))
            },
            routeName: xmlDoc.querySelector(this.nameMetadataSelector)?.textContent ?? undefined,
        }
    };
}
