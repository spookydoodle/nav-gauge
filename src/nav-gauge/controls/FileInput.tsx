import { Dispatch, FC, SetStateAction } from "react";
import { parsers, FileToGeoJSONParser, ParsingResultWithError, GeoJson } from "../../logic";
import { FileInputStatus } from "../../components";

interface Props {
    routeName?: string;
    error?: Error;
    geojson?: GeoJson;
    onGeojsonChange: Dispatch<SetStateAction<ParsingResultWithError>>;
    readImage: (file: File) => void;
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
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            if (file.type.includes('image')) {
                readImage(file);
                continue;
            }
            onGeojsonChange({});
            parsers
                .get(FileToGeoJSONParser.getFileExtension(file))
                ?.parse(file)
                .then((result => onGeojsonChange(result ?? { error: new Error('No parser found for file.') })));

        }
    };

    return (
        <div>
            <input id="files" type="file" multiple accept={[...parsers.keys(), "image/png", "image/jpeg", "image/jpg"].join(', ')} onChange={handleInput} />
            <FileInputStatus ok={!!geojson && !error} error={error} routeName={routeName} />
        </div>
    );
};
