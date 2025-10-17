import { FC, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import turfAlong from "@turf/along";
import * as turfHelpers from "@turf/helpers";
import turfLength from "@turf/length";
import { useMap } from "../../map/useMap";
import { GeoJson, ImageData } from "../../parsers";
import { useGaugeSettings } from "../../gauge-settings/use-gauge-settings";

const clearLayersAndSources = (
    map: maplibregl.Map,
    layerIds: string[],
    sourceIds: string[]
) => {

    for (const id of layerIds) {
        if (map.getLayer(id)) {
            map.removeLayer(id);
        }
    }
    for (const id of sourceIds) {
        if (map.getSource(id)) {
            map.removeSource(id);
        }
    }
};
export interface RouteTimes {
    startTime: string;
    endTime: string;
    startTimeEpoch: number;
    endTimeEpoch: number;
    duration: number;
}

const colorActive = '#003161';
const colorInactive = 'grey';

const sourceId = 'route';

const sourceIds = {
    currentPoint: sourceId + '-current-point',
    line: sourceId + '-line',
    image: sourceId + '-image',
}

const layerIds = {
    currentPointOutline: 'route-current-point-outline',
    currentPoint: 'route-current-point',
    points: 'route-points',
    line: 'route-line',
    images: 'route-image',
}

const getCurrentPoint = (
    geojson: GeoJson,
    splitIndex: number,
    currentTime: number
) => {
    const currentLineStart = geojson.features[Math.max(0, splitIndex - 1)];
    const currentLineEnd = geojson.features[splitIndex];
    const currentLineStartTime = new Date(currentLineStart.properties.time).valueOf();
    const currentLineEndTime = new Date(currentLineEnd.properties.time).valueOf();

    const fraction = Number(((currentTime - currentLineStartTime) / (currentLineEndTime - currentLineStartTime)).toFixed(2));
    const currentLineStartPos = currentLineStart.geometry.coordinates;
    const currentLineEndPos = currentLineEnd.geometry.coordinates;
    const line = turfHelpers.lineString([currentLineStartPos, currentLineEndPos]);
    const totalDistance = turfLength(line, { units: 'meters' });

    return turfAlong(line, totalDistance * fraction, { units: 'meters' });
};

const getData = (
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number,
): [GeoJSON.Feature<GeoJSON.Point>, GeoJSON.GeoJSON] => {
    const currentTime = startTimeEpoch + progressMs;
    const splitIndex = geojson.features.findIndex((f) => new Date(f.properties.time).valueOf() > new Date(currentTime).valueOf());
    const currentPoint = getCurrentPoint(geojson, splitIndex, currentTime);

    return [currentPoint, {
        ...geojson,
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: geojson.features.slice(0, splitIndex).map((f) => f.geometry.coordinates).concat([currentPoint.geometry.coordinates])
                },
                properties: {
                    status: 'before',
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [currentPoint.geometry.coordinates].concat(geojson.features.slice(splitIndex).map((f) => f.geometry.coordinates))
                },
                properties: {
                    status: 'after',
                }
            },
        ]
    }];
};

interface Props {
    isPlaying: boolean;
    geojson: GeoJson;
    routeTimes: RouteTimes;
    progressMs: number;
    onProgressMsChange: React.Dispatch<React.SetStateAction<number>>;
    images: ImageData[];
}

export const RouteLayer: FC<Props> = ({
    isPlaying,
    geojson,
    routeTimes,
    progressMs,
    onProgressMsChange,
    images
}) => {
    const { map } = useMap();
    const { showRouteLine, showRoutePoints } = useGaugeSettings();
    const [isLayerAdded, setIsLayerAdded] = useState(false);

    useEffect(() => {
        const [currentPoint, lines] = getData(geojson, routeTimes.startTimeEpoch, progressMs);
        if (showRouteLine || showRoutePoints) {
            map.addSource(sourceIds.line, {
                type: 'geojson',
                data: lines,
            });
        }

        map.addSource(sourceIds.currentPoint, {
            type: 'geojson',
            data: currentPoint,
        });

        if (showRouteLine) {
            map.addLayer({
                id: layerIds.line,
                source: sourceIds.line,
                type: 'line',
                paint: {
                    'line-color': [
                        'case',
                        ['==', ['get', 'status'], 'before'],
                        colorActive,
                        colorInactive
                    ],
                    'line-width': 4,
                    'line-opacity': .6,
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round'
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
                        colorActive,
                        colorInactive
                    ],
                    'circle-radius': 3,
                }
            });
        }

        map.addLayer({
            id: layerIds.currentPointOutline,
            source: sourceIds.currentPoint,
            type: 'circle',
            paint: {
                'circle-color': 'white',
                'circle-radius': 7,
            }
        });
        map.addLayer({
            id: layerIds.currentPoint,
            source: sourceIds.currentPoint,
            type: 'circle',
            paint: {
                'circle-color': colorActive,
                'circle-radius': 5,
            }
        });

        setIsLayerAdded(true);

        return () => {
            setIsLayerAdded(false);
            clearLayersAndSources(
                map, 
                [layerIds.line, layerIds.points, layerIds.currentPointOutline, layerIds.currentPoint],
                [sourceIds.line, sourceIds.currentPoint]
            );
        };
    }, [map, geojson, showRouteLine, showRoutePoints]);

    useEffect(() => {
        const loadedImages = images.filter((image) => image.data && image.lngLat && image.time && !image.error);
        if (loadedImages.length === 0) {
            return;
        }
        const markers: maplibregl.Marker[] = [];
        const markerElements: HTMLElement[] = [];
        for (const image of loadedImages) {
            const el = document.createElement('img');
            el.src = image.data!;
            markerElements.push(el);

            el.className = 'marker';
            el.style.display = "block";
            el.style.objectFit = 'contain';
            el.style.width = `30px`;
            el.style.height = `30px`;
            el.style.borderRadius = "50%";
            el.style.border = "2px solid white";

            markers.push(new maplibregl.Marker({
                element: el,
            })
                .setLngLat([image.lngLat!.lng, image.lngLat!.lat])
                .addTo(map));
        }
        
        map.addSource(sourceIds.image, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: loadedImages.map((image): GeoJSON.Feature<GeoJSON.Point> => ({
                    type: 'Feature',
                    geometry: geojson.features.find((f) => f.properties.time === image.time)?.geometry!,
                    properties: {}
                }))
                    .filter((el) => !!el.geometry)
            }
        });

        map.addLayer({
            id: layerIds.images,
            type: 'circle',
            source: sourceIds.image,
            paint: {
                'circle-color': "red",
                "circle-radius": 5
            }
        });

        return () => {
            markers.forEach((marker) => marker.remove());
            clearLayersAndSources(
                map,
                [layerIds.images],
                [sourceIds.image]
            );
        };
    }, [map, images]);

    useEffect(() => {
        if (!isPlaying || !isLayerAdded) {
            return;
        }
        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        let animation: number | undefined;
        let current = progressMs;

        const animate = () => {
            current += 10000;
            if (startTimeEpoch + current >= endTimeEpoch) {
                current = 0;
            }
            const [currentPoint, lines] = getData(geojson, startTimeEpoch, current);
            map.getSource<maplibregl.GeoJSONSource>(sourceIds.currentPoint)?.setData(currentPoint);
            map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(lines);
            // TODO: Calculate % of geometry done based on current progressMs and update paint property line gradient instead of all data.
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
        const [currentPoint, lines] = getData(geojson, startTimeEpoch, progressMs);
        map.getSource<maplibregl.GeoJSONSource>(sourceIds.currentPoint)?.setData(currentPoint);
        map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(lines);
    }, [progressMs]);

    return null;
};
