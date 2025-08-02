import { ParsingResult } from "./model";

export abstract class FileToGeoJSONParser {
    /**
     * @example `[".gpx"]`
     */
    public abstract acceptedFileExtensions: string[];
    
    /**
     * Parses given file to GeoJSON format.
     * @param file File to parse.
     * @returns GeoJSON, route name from metadata and error (if processing failed).
     */
    public abstract parseFile: (file: File) => Promise<ParsingResult>;
    
    /**
     * Extracts raw text from a given file.
     * @param file File to extract text from.
     * @returns Data as raw text.
     */
    public abstract rawText: (file: File) => Promise<string>;
    
    /**
     * Parses text received from reading a given file to GeoJSON format.
     * @param text Text to parse.
     * @returns GeoJSON, route nam from metadata and error (if processing failed).
     */
    public abstract parseTextToGeoJson: (text: string) => ParsingResult;

    /**
     * @returns File extension extracted from file name.
     */
    public static getFileExtension = (file: File): string => {
        return '.' + file.name.split('.').slice(-1)[0];
    }
}
