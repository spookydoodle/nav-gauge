import { useState } from "react";
import { MapTools } from "./MapTools";
import { RouteLayer } from "./RouteLayer";
import { RouteLayerFitBounds } from "./RouteLayerFitBounds";
import { Player } from "./Player";
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
