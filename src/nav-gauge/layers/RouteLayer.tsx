import { FC, useCallback, useEffect, useState } from "react";
import { useMap } from "../../map/useMap";
import { GeoJson } from "../../parsers";
import { useGaugeSettings } from "../../gauge-settings/use-gauge-settings";

export interface RouteTimes {
    startTime: string;
    endTime: string;
    startTimeEpoch: number;
    endTimeEpoch: number;
    duration: number;
}

const sourceId = 'route';

const sourceIds = {
    line: sourceId + '-line',
}

const layerIds = {
    points: 'route-points',
    line: 'route-line'
}

const getData = (
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number
): GeoJSON.GeoJSON => {
    const splitIndex = geojson.features.findIndex((f) => new Date(f.properties.time).valueOf() > new Date(startTimeEpoch + progressMs).valueOf());

    return {
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
    };
};

interface Props {
    isPlaying: boolean;
    geojson: GeoJson;
    routeTimes: RouteTimes;
    progressMs: number;
    onProgressMsChange: React.Dispatch<React.SetStateAction<number>>;
}

export const RouteLayer: FC<Props> = ({
    isPlaying,
    geojson,
    routeTimes,
    progressMs,
    onProgressMsChange
}) => {
    const { map } = useMap();
    const { showRouteLine, showRoutePoints } = useGaugeSettings();
    const [isLayerAdded, setIsLayerAdded] = useState(false);

    useEffect(() => {
        if (showRouteLine || showRoutePoints) {
            map.addSource(sourceIds.line, {
                type: 'geojson',
                data: getData(geojson, routeTimes.startTimeEpoch, progressMs),
            });
        }

        if (showRouteLine) {
            map.addLayer({
                id: layerIds.line,
                source: sourceIds.line,
                type: 'line',
                paint: {
                    'line-color': [
                        'case',
                        ['==', ['get', 'status'], 'before'],
                        'black',
                        'grey'
                    ],
                    'line-width': 4,
                    'line-opacity': .6,
                }
            });
        }

        if (showRoutePoints) {
            map.addLayer({
                id: layerIds.points,
                source: sourceIds.line,
                type: 'circle',
                paint: {
                    'circle-color': [
                        'case',
                        ['==', ['get', 'status'], 'before'],
                        'black',
                        'grey'
                    ],
                    'circle-radius': 3,
                }
            });
        }

        setIsLayerAdded(true);

        return () => {
            setIsLayerAdded(false);
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

    useEffect(() => {
        if (!isPlaying || !isLayerAdded) {
            return;
        }
        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        let animation: number | undefined;
        let current = progressMs;

        const animate = () => {
            current += 10000;
            if (startTimeEpoch + current > endTimeEpoch) {
                current = 0;
            }
            map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(getData(geojson, startTimeEpoch, current));
            onProgressMsChange(current);
            animation = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animation) {
                cancelAnimationFrame(animation);
            }
        };
    }, [isPlaying, isLayerAdded]);

    useEffect(() => {
        if (isPlaying) {
            return;
        }
        const { startTimeEpoch } = routeTimes;
        map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(getData(geojson, startTimeEpoch, progressMs));
    }, [progressMs]);

    useEffect(() => {
        if (progressMs === 0) {
            map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(getData(geojson, routeTimes.startTimeEpoch, 0));
        }
    }, [progressMs]);

    return null;
};
