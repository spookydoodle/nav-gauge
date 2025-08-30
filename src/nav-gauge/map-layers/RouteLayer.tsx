import { FC, useEffect } from "react";
import { useMap } from "../../map/useMap";
import { GeoJson } from "../../parsers";
import { useGaugeSettings } from "../../gauge-settings/use-gauge-settings";

const sourceId = 'route';

const sourceIds = {
    line: sourceId + '-points',
    points: sourceId + '-line'
}

const layerIds = {
    points: 'route-points',
    line: 'route-line'
}

interface Props {
    geojson: GeoJson;
    boundingBox: GeoJSON.BBox;
    time?: string;
}

export const RouteLayer: FC<Props> = ({
    geojson,
    boundingBox,
    time,
}) => {
    const { map } = useMap();
    const { showRouteLine, showRoutePoints } = useGaugeSettings();

    useEffect(() => {
        map.fitBounds(
            [boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]],
            { animate: true, padding: 50 }
        );

        if (showRouteLine) {
            const splitIndex = !time ? 0 : geojson.features.findIndex((f) => new Date(f.properties.time).valueOf() > new Date(time).valueOf());

            map.addSource(sourceIds.line, {
                type: 'geojson',
                data: {
                    ...geojson,
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: geojson.features.slice(0, splitIndex).map((f) => f.geometry.coordinates)
                            },
                            properties: {
                                status: 'before'
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: geojson.features.slice(splitIndex).map((f) => f.geometry.coordinates)
                            },
                            properties: {
                                status: 'after'
                            }
                        },
                    ]
                },
            });

            map.addLayer({
                id: layerIds.line,
                source: sourceIds.line,
                type: 'line',
                paint: {
                    'line-color': [
                        'case',
                        ['==', ['get', 'status'], 'before'],
                        'red',
                        'green'
                    ],
                    'line-width': 5,
                    'line-opacity': .4,
                }
            });
        }

        if (showRoutePoints) {
            map.addSource(sourceIds.points, {
                type: 'geojson',
                data: geojson,
            });

            map.addLayer({
                id: layerIds.points,
                source: sourceIds.points,
                type: 'circle',
                paint: {
                    'circle-color': 'blue',
                    'circle-radius': 5,
                }
            });
        }

        return () => {
            for (const id of Object.values(layerIds)) {
                if (map.getLayer(id)) {
                    map.removeLayer(id);
                }
            }
            for (const id of Object.values(sourceIds)) {
                if (map.getSource(id)) {
                    map.removeSource(id);
                }
            }
        };
    }, [map, geojson, showRouteLine, showRoutePoints]);

    return null;
};
