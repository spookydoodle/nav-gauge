import { FC, useEffect } from "react";
import { useMap } from "../map/useMap";
import bbox from "@turf/bbox";

const sourceId = 'route';
const layerIds = {
    points: 'route-points',
    line: 'route-line'
}

interface Props {
    name?: string;
    geojson: GeoJSON.FeatureCollection;
}

export const RouteLayer: FC<Props> = ({
    name,
    geojson
}) => {
    const { map } = useMap();

    useEffect(() => {
        const boundingBox = bbox(geojson);
        map.fitBounds(
            [boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]],
            { animate: true, padding: 20 }
        );

        map.addSource(sourceId, {
            type: 'geojson',
            data: geojson,
        });

        map.addLayer({
            id: layerIds.line,
            source: sourceId,
            type: 'line',
            paint: {
                'line-color': 'red',
                'line-width': 2,
                'line-opacity': .4,
            }
        });

        map.addLayer({
            id: layerIds.points,
            source: sourceId,
            type: 'circle',
            paint: {
                'circle-color': 'blue',
                'circle-radius': 5,
            }
        });

        return () => {
            for (const id of Object.values(layerIds)) {
                map.removeLayer(id);
            }
            map.removeSource(sourceId);
        };
    }, [map, geojson]);

    return null;
};
