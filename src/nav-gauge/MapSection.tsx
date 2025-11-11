import { useState } from "react";
import { MapTools } from "./map-tools/MapTools";
import { RouteLayer } from "./layers/RouteLayer";
import { RouteLayerFitBounds } from "./layers/RouteLayerFitBounds";
import { Player } from "./player/Player";
import { RouteTimes, GeoJson, ImageData } from "../logic";

interface Props {
    geojson?: GeoJson;
    boundingBox?: GeoJSON.BBox;
    images: ImageData[];
    updateImageFeatureId: (imageId: number, featureId: number) => void;
    routeTimes?: RouteTimes;
    progressMs: number;
    onProgressMsChange: React.Dispatch<React.SetStateAction<number>>;
}

export const MapSection: React.FC<Props> = ({
    geojson,
    boundingBox,
    images,
    updateImageFeatureId,
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
                    updateImageFeatureId={updateImageFeatureId}
                />
                : null}
        </MapTools>
    );
};
