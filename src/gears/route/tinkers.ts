import maplibregl from "maplibre-gl";
import turfBearing from "@turf/bearing";
import turfDistance from "@turf/distance";
import turfAlong from "@turf/along";
import { point as turfPoint, lineString as turfLine } from "@turf/helpers";
import turfLength from "@turf/length";
import {
    GeoJson,
    // TODO: Move
    CurrentPointData,
    IMAGE_SIZE,
    LoadedImageData
} from "@apparatus";
import { sourceIds } from "./layers";

/**
 * Gets current point data, updates map sources, and returns it.
 */
export const updateRouteLayer = (
    map: maplibregl.Map,
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number,
    bearingLineLengthInMeters: number,
    nextImageFeatureId?: number,
): CurrentPointData => {
    const { currentPoint, lines, ...rest } = getRouteSourceData(geojson, startTimeEpoch, progressMs, bearingLineLengthInMeters, nextImageFeatureId);
    map.getSource<maplibregl.GeoJSONSource>(sourceIds.currentPoint)?.setData(currentPoint);
    map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(lines);

    return { currentPoint, lines, ...rest };
};

export const getRouteSourceData = (
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number,
    bearingLineLengthInMeters: number,
    nextImageFeatureId?: number,
): CurrentPointData => {
    const currentTime = startTimeEpoch + progressMs;
    const splitIndex = geojson.features.findIndex((f) =>
        new Date(f.properties.time).valueOf() > new Date(currentTime).valueOf() ||
        (nextImageFeatureId !== undefined && f.properties.id === nextImageFeatureId)
    );
    const { currentPoint, currentPointBearing, currentPointSpeed } = getCurrentPoint(geojson, splitIndex, currentTime, bearingLineLengthInMeters);

    return {
        currentPoint,
        currentPointBearing,
        currentPointSpeed,
        lines: {
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
        }
    };
};

/**
 * @returns current point feature with its bearing and speed calculated out of a line where start/end point are the first points before//after the current point at least 10 meter distance away.
 */
const getCurrentPoint = (
    geojson: GeoJson,
    splitIndex: number,
    currentTime: number,
    bearingLineLengthInMeters: number,
): {
    currentPoint: GeoJSON.Feature<GeoJSON.Point>;
    currentPointBearing: number;
    currentPointSpeed: number;
} => {
    const indexes = [Math.max(0, splitIndex - 1), Math.max(1, splitIndex)];
    const currentLineStart = geojson.features[indexes[0]];
    const currentLineEnd = geojson.features[indexes[1]];
    const currentLineStartTime = new Date(currentLineStart.properties.time).valueOf();
    const currentLineEndTime = new Date(currentLineEnd.properties.time).valueOf();

    const fraction = Number(((currentTime - currentLineStartTime) / (currentLineEndTime - currentLineStartTime)).toFixed(2));
    const currentLineStartPos = currentLineStart.geometry.coordinates;
    const currentLineEndPos = currentLineEnd.geometry.coordinates;
    const line = turfLine([currentLineStartPos, currentLineEndPos]);
    const totalDistanceMeters = turfLength(line, { units: 'meters' });
    const totalTimeMs = (new Date(currentLineEnd.properties.time).valueOf() - new Date(currentLineStart.properties.time).valueOf());
    const currentPoint = { ...currentLineEnd };

    if (!('featureId' in currentPoint.properties)) {
        currentPoint.geometry = turfAlong(line, totalDistanceMeters * fraction, { units: 'meters' }).geometry
    };

    const currentPointSpeed = (totalDistanceMeters) / (totalTimeMs / 3600);

    return {
        currentPoint,
        currentPointBearing: getCurrentPointBearing(currentPoint, geojson, splitIndex, bearingLineLengthInMeters),
        currentPointSpeed
    };
};

/**
 * Gets bearing of a line created by the first points before/after current point at least `minDistanceInMeters` away. Defaults to 10m.
 */
const getCurrentPointBearing = (
    currentPoint: GeoJSON.Feature<GeoJSON.Point>,
    geojson: GeoJson,
    splitIndex: number,
    bearingLineLengthInMeters: number
): number => {
    const before = geojson.features.slice(0, splitIndex);
    const after = geojson.features.slice(splitIndex);
    const p1 = getFirstPointInDistance(currentPoint, after.concat(before).toReversed(), bearingLineLengthInMeters);
    const p2 = getFirstPointInDistance(currentPoint, after.concat(before), bearingLineLengthInMeters);

    if (!p1 || !p2) {
        return 0;
    }

    return turfBearing(turfPoint(p1), turfPoint(p2));
};

const getFirstPointInDistance = (
    currentPoint: GeoJSON.Feature<GeoJSON.Point>,
    features: GeoJSON.Feature<GeoJSON.Point>[],
    bearingLineLengthInMeters: number
): GeoJSON.Position | undefined => {
    let p: GeoJSON.Position | undefined;
    let distance = 0;
    for (const { geometry } of features) {
        distance += turfDistance(currentPoint, geometry.coordinates, { units: 'meters' });
        if (distance > (bearingLineLengthInMeters / 2)) {
            p = geometry.coordinates
            break;
        }
    }
    return p;
};

export const getImageIconSize = (
    imageSize: number,
    desiredSize: number,
): number => {
    return 1 / (imageSize / desiredSize);
};

export const getIconImageId = (image: LoadedImageData): string => `image-${image.id}`;
