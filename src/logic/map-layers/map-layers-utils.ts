import maplibregl from "maplibre-gl";
import turfAlong from "@turf/along";
import * as turfHelpers from "@turf/helpers";
import turfLength from "@turf/length";
import { GeoJson } from "../parsers";

export const clearLayersAndSources = (
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

export const colorActive = '#003161';
export const colorInactive = 'grey';

export const sourceId = 'route';

export const sourceIds = {
    currentPoint: sourceId + '-current-point',
    line: sourceId + '-line',
    image: sourceId + '-image',
}

export const layerIds = {
    currentPointOutline: 'route-current-point-outline',
    currentPoint: 'route-current-point',
    points: 'route-points',
    line: 'route-line',
    images: 'route-image',
}

export const getCurrentPoint = (
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

export const getData = (
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