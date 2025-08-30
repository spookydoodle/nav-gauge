import { FileToGeoJSONParser } from './file-parser';
import { GpxParser } from './gpx-parser';
import { KmlParser } from './kml-parser';

export const parsers = new Map<string, FileToGeoJSONParser>([
    new GpxParser(),
    new KmlParser(),
].flatMap((parser) => parser.acceptedFileExtensions.map((extension) => [extension, parser])));

export { FileToGeoJSONParser } from './file-parser';
export { GpxParser } from './gpx-parser';
export { KmlParser } from './kml-parser';
export * from './model';
