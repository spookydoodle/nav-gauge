import { FC, useCallback, useEffect, useState } from "react";
import { useMap } from "../../map/useMap";
import { GeoJson } from "../../parsers";
import { useGaugeSettings } from "../../gauge-settings/use-gauge-settings";

const sourceId = 'route';

const sourceIds = {
    line: sourceId + '-line',
}

const layerIds = {
    points: 'route-points',
    line: 'route-line'
}

const getData = (geojson: GeoJson, time?: number): GeoJSON.GeoJSON => {
    const splitIndex = !time ? 0 : geojson.features.findIndex((f) => new Date(f.properties.time).valueOf() > new Date(time).valueOf());

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
    duration?: number;
    timeEpoch?: number;
    startTimeEpoch?: number;
    endTimeEpoch?: number;
    onTimeEpochChange: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const RouteLayer: FC<Props> = ({
    isPlaying,
    geojson,
    duration,
    timeEpoch,
    startTimeEpoch,
    endTimeEpoch,
    onTimeEpochChange
}) => {
    const { map } = useMap();
    const { showRouteLine, showRoutePoints } = useGaugeSettings();
    const [isLayerAdded, setIsLayerAdded] = useState(false);

    useEffect(() => {
        if (showRouteLine || showRoutePoints) {
            map.addSource(sourceIds.line, {
                type: 'geojson',
                data: getData(geojson, timeEpoch),
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
        // TODO: fix this long condition
        if (!isPlaying || !isLayerAdded || timeEpoch === undefined || startTimeEpoch === undefined || duration === undefined || endTimeEpoch === undefined) {
            return;
        }
        let animation: number | undefined;
        let current = timeEpoch - startTimeEpoch;
        const animate = () => {
            current += 10000;
            if (startTimeEpoch + current > endTimeEpoch) {
                console.log("AA")
                current = 0;
            }
            const time = startTimeEpoch + current;
            const source = map.getSource(sourceIds.line) as maplibregl.GeoJSONSource;
            const data = getData(geojson, time);
            source.setData(data);
            onTimeEpochChange(time);
            animation = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animation) {
                cancelAnimationFrame(animation);
                const source = map.getSource(sourceIds.line) as maplibregl.GeoJSONSource;
                const data = getData(geojson, startTimeEpoch);
                source.setData(data);
            }
        };
    }, [isPlaying, isLayerAdded]);

    return null;
};
