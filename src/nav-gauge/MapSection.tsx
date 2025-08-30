import { useEffect, useMemo, useState } from "react";
import { MapTools } from "./map-tools/MapTools";
import { RouteLayer } from "./layers/RouteLayer";
import { RouteLayerFitBounds } from "./layers/RouteLayerFitBounds";
import { Player } from "./player/Player";
import { GeoJson } from "../parsers";

interface Props {
    geojson?: GeoJson;
    boundingBox?: GeoJSON.BBox;
}

export const MapSection: React.FC<Props> = ({
    geojson,
    boundingBox,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const startTime = useMemo(
        (): string | undefined => geojson ? geojson.features[0]?.properties.time : undefined,
        [geojson]
    );
    const endTime = useMemo(
        (): string | undefined => geojson ? geojson.features.slice(-1)[0]?.properties.time : undefined,
        [geojson]
    );
    const startTimeEpoch = useMemo(
        () => startTime ? new Date(startTime).valueOf() : undefined,
        [startTime]
    );
    const endTimeEpoch = useMemo(
        () => endTime ? new Date(endTime).valueOf() : undefined,
        [endTime]
    );
    const duration = useMemo(
        () => endTimeEpoch !== undefined && startTimeEpoch !== undefined ? endTimeEpoch - startTimeEpoch : undefined,
        [startTimeEpoch, endTimeEpoch]
    );
    const [timeEpoch, setTimeEpoch] = useState<number>();

    return (
        <MapTools
            toolsLeft={<RouteLayerFitBounds boundingBox={boundingBox} />}
            toolsBottom={<Player
                timeEpoch={timeEpoch}
                startTimeEpoch={startTimeEpoch}
                endTimeEpoch={endTimeEpoch}
                isPlaying={isPlaying}
                onIsPlayingChange={setIsPlaying}
                onStop={(() => setTimeEpoch(startTimeEpoch))}
            />}
        >
            {geojson && boundingBox
                ? <RouteLayer
                    isPlaying={isPlaying}
                    geojson={geojson}
                    duration={duration}
                    timeEpoch={timeEpoch}
                    startTimeEpoch={startTimeEpoch}
                    endTimeEpoch={endTimeEpoch}
                    onTimeEpochChange={setTimeEpoch}
                />
                : null}
        </MapTools>
    );
};
