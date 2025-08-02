import { FileToGeoJSONParser } from './file-parser';
import { GeoJsonParser } from './geojson-parser';
import { GpxParser } from './gpx-parser';
import { KmlParser } from './kml-parser';

// TODO: Check for linestrings in all parsers
export const parsers = new Map<string, FileToGeoJSONParser>([
    new GeoJsonParser(),
    new GpxParser(),
    new KmlParser(),
].flatMap((parser) => parser.acceptedFileExtensions.map((extension) => [extension, parser])));

export { GeoJsonParser } from './geojson-parser';
export { GpxParser } from './gpx-parser';
export { KmlParser } from './kml-parser';