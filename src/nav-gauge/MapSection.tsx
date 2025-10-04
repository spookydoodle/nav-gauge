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
}

export const MapSection: React.FC<Props> = ({
    geojson,
    boundingBox,
    images,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const routeTimes = useMemo(
        (): RouteTimes | undefined => {
            if (!geojson?.features[0]) {
                return;
            }
            const startTime = geojson.features[0].properties.time;
            const endTime = geojson.features.slice(-1)[0]?.properties.time;
            const startTimeEpoch = new Date(startTime).valueOf();
            const endTimeEpoch = new Date(endTime).valueOf();

            return {
                startTime,
                endTime,
                startTimeEpoch,
                endTimeEpoch,
                duration: endTimeEpoch - startTimeEpoch
            }
        },
        [geojson]
    );

    const [progressMs, setProgressMs] = useState(0);

    return (
        <MapTools
            toolsLeft={<RouteLayerFitBounds boundingBox={boundingBox} />}
            toolsBottom={<Player
                images={images}
                routeTimes={routeTimes}
                progressMs={progressMs}
                onProgressMsChange={setProgressMs}
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
                    onProgressMsChange={setProgressMs}
                />
                : null}
        </MapTools>
    );
};
