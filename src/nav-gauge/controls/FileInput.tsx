import { Dispatch, FC, SetStateAction } from "react";
import { parsers, FileToGeoJSONParser, ParsingResultWithError, GeoJson } from "../../logic";
import { FileInputStatus } from "../../components";

interface Props {
    routeName?: string;
    error?: Error;
    geojson?: GeoJson;
    onGeojsonChange: Dispatch<SetStateAction<ParsingResultWithError>>;
    readImage: (file: File, geojson?: GeoJson) => void;
}

export const FileInput: FC<Props> = ({
    routeName,
    error,
    geojson,
    onGeojsonChange,
    readImage,
}) => {
    const handleInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || files.length === 0) {
            return;
        }
        let currentGeojson = geojson;
        let geojsonFile: File | undefined = undefined;
        let imageFiles: File[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            if (file.type.includes('image')) {
                imageFiles.push(file);
                continue;
            }
            geojsonFile = file;
        }

        if (geojsonFile) {
            onGeojsonChange({});
            const result = await parsers
                .get(FileToGeoJSONParser.getFileExtension(geojsonFile))
                ?.parse(geojsonFile);
            onGeojsonChange(result ?? { error: new Error('No parser found for file.') });
            currentGeojson = result?.geojson
        }
        
        imageFiles.forEach((file) => readImage(file, currentGeojson));
    };

    return (
        <div>
            <input id="files" type="file" multiple accept={[...parsers.keys(), "image/png", "image/jpeg", "image/jpg"].join(', ')} onChange={handleInput} />
            <FileInputStatus ok={!!geojson && !error} error={error} routeName={routeName} />
        </div>
    );
};
