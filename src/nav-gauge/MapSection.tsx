import { useState } from "react";
import { MapTools } from "./map-tools/MapTools";
import { RouteLayer } from "./map-layers/RouteLayer";
import { RouteLayerFitBounds } from "./map-layers/RouteLayerFitBounds";
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
    const [time, setTime] = useState<string | undefined>(geojson?.features[0].properties.time);

    return (
        <MapTools
            toolsLeft={<RouteLayerFitBounds boundingBox={boundingBox} />}
            toolsBottom={<Player />}
        >
            {geojson && boundingBox
                ? <RouteLayer geojson={geojson} boundingBox={boundingBox} time={time} />
                : null}
        </MapTools>
    );
};
