import { FC, useEffect } from "react";
import { useMap } from "../map/useMap";

const sourceId = 'route';
const layerIds = {
    points: 'route-points',
    line: 'route-line'
}

interface Props {
    routeName?: string;
    geojson: GeoJSON.GeoJSON;
    boundingBox: GeoJSON.BBox;
}

export const RouteLayer: FC<Props> = ({
    routeName,
    geojson,
    boundingBox,
}) => {
    const { map } = useMap();

    useEffect(() => {
        map.fitBounds(
            [boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]],
            { animate: true, padding: 50 }
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
