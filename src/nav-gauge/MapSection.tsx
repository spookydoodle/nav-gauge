import { useMemo, useState } from "react";
import { MapTools } from "./map-tools/MapTools";
import { RouteLayer, RouteTimes } from "./layers/RouteLayer";
import { RouteLayerFitBounds } from "./layers/RouteLayerFitBounds";
import { Player } from "./player/Player";
import { GeoJson, ImageData } from "../parsers";

interface Props {
    geojson?: GeoJson;
    boundingBox?: GeoJSON.BBox;
    images: ImageData[];
    routeTimes?: RouteTimes;
    progressMs: number;
    onProgressMsChange: React.Dispatch<React.SetStateAction<number>>;
}

export const MapSection: React.FC<Props> = ({
    geojson,
    boundingBox,
    images,
    routeTimes,
    progressMs,
    onProgressMsChange,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <MapTools
            toolsLeft={<RouteLayerFitBounds boundingBox={boundingBox} />}
            toolsBottom={<Player
                geojson={geojson}
                images={images}
                routeTimes={routeTimes}
                progressMs={progressMs}
                onProgressMsChange={onProgressMsChange}
                isPlaying={isPlaying}
                onIsPlayingChange={setIsPlaying}
            />}
        >
            {geojson && boundingBox && routeTimes
                ? <RouteLayer
                    isPlaying={isPlaying}
                    geojson={geojson}
                    routeTimes={routeTimes}
                    progressMs={progressMs}
                    onProgressMsChange={onProgressMsChange}
                    images={images}
                />
                : null}
        </MapTools>
    );
};
