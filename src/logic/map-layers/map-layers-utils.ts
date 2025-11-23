import maplibregl from "maplibre-gl";
import turfBearing from "@turf/bearing";
import turfDistance from "@turf/distance";
import turfAlong from "@turf/along";
import * as turfHelpers from "@turf/helpers";
import turfLength from "@turf/length";
import { FeatureProperties, GeoJson, ImageData } from "../parsers";
import { CurrentPointData, FeatureStateProps } from "./model";

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

export const getImagesSourceData = (
    geojson: GeoJson,
    loadedImages: ImageData[]
): GeoJSON.FeatureCollection => {
    return {
        type: 'FeatureCollection',
        features: loadedImages.map((image): GeoJSON.Feature<GeoJSON.Point> => ({
            type: 'Feature',
            geometry: geojson.features.find((f) => f.properties.id === image.id)?.geometry!,
            properties: {}
        }))
            .filter((el) => !!el.geometry)
    };
};

export const layerIds = {
    currentPointOutline: 'route-current-point-outline',
    currentPoint: 'route-current-point',
    points: 'route-points',
    line: 'route-line',
    images: 'route-image',
}

export const routeLineLayer: maplibregl.LineLayerSpecification = {
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
        'line-width': 2,
        'line-opacity': .6,
    },
    layout: {
        'line-cap': 'round',
        'line-join': 'round'
    }
};

export const routePointsLayer: maplibregl.CircleLayerSpecification = {
    id: layerIds.points,
    source: sourceIds.line,
    type: 'circle',
    paint: {
        'circle-color': [
            'case',
            ["==", ["feature-state", FeatureStateProps.Highlight], true],
            'red',
            ['==', ['get', 'status'], 'before'],
            colorActive,
            colorInactive
        ],
        'circle-radius': 2,
    }
};

export const currentPointLayers: maplibregl.CircleLayerSpecification[] = [
    {
        id: layerIds.currentPointOutline,
        source: sourceIds.currentPoint,
        type: 'circle',
        paint: {
            'circle-color': 'white',
            'circle-radius': 7,
        }
    },
    {
        id: layerIds.currentPoint,
        source: sourceIds.currentPoint,
        type: 'circle',
        paint: {
            'circle-color': colorActive,
            'circle-radius': 5,
        }
    }
];

// TODO: Style fallback for broken images
export const imagesLayer: maplibregl.CircleLayerSpecification = {
    id: layerIds.images,
    type: 'circle',
    source: sourceIds.image,
    paint: {
        'circle-color': "red",
        "circle-radius": 3
    }
};

/**
 * Gets current point data, updates map sources, and returns it.
 */
export const updateRouteLayer = (
    map: maplibregl.Map,
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number,
): CurrentPointData => {
    const { currentPoint, lines, ...rest } = getRouteSourceData(geojson, startTimeEpoch, progressMs);
    map.getSource<maplibregl.GeoJSONSource>(sourceIds.currentPoint)?.setData(currentPoint);
    map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(lines);

    return { currentPoint, lines, ...rest };
};

/**
 * @returns current point feature with its bearing and speed calculated out of a line where start/end point are the first points before//after the current point at least 10 meter distance away.
 */
const getCurrentPoint = (
    geojson: GeoJson,
    splitIndex: number,
    currentTime: number
): {
    currentPoint: GeoJSON.Feature<GeoJSON.Point>;
    currentPointBearing: number;
    currentPointSpeed: number;
} => {
    const currentLineStart = geojson.features[Math.max(0, splitIndex - 1)];
    const currentLineEnd = geojson.features[Math.max(1, splitIndex)];
    const currentLineStartTime = new Date(currentLineStart.properties.time).valueOf();
    const currentLineEndTime = new Date(currentLineEnd.properties.time).valueOf();

    const fraction = Number(((currentTime - currentLineStartTime) / (currentLineEndTime - currentLineStartTime)).toFixed(2));
    const currentLineStartPos = currentLineStart.geometry.coordinates;
    const currentLineEndPos = currentLineEnd.geometry.coordinates;
    const line = turfHelpers.lineString([currentLineStartPos, currentLineEndPos]);
    const totalDistanceMeters = turfLength(line, { units: 'meters' });
    const totalTimeMs = (new Date(currentLineEnd.properties.time).valueOf() - new Date(currentLineStart.properties.time).valueOf());
    const currentPoint = turfAlong(line, totalDistanceMeters * fraction, { units: 'meters' });
    const currentPointSpeed = (totalDistanceMeters) / (totalTimeMs / 3600);

    return {
        currentPoint,
        currentPointBearing: getCurrentPointBearing(currentPoint, geojson, splitIndex),
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
    minDistanceInMeters = 250
): number => {
    const before = geojson.features.slice(0, splitIndex);
    const after = geojson.features.slice(splitIndex);
    const p1 = getFirstPointInDistance(currentPoint, after.concat(before).toReversed(), minDistanceInMeters);
    const p2 = getFirstPointInDistance(currentPoint, after.concat(before), minDistanceInMeters);

    if (!p1 || !p2) {
        return 0;
    }

    return turfBearing(turfHelpers.point(p1), turfHelpers.point(p2));
};

const getFirstPointInDistance = (
    currentPoint: GeoJSON.Feature<GeoJSON.Point>,
    features: GeoJSON.Feature<GeoJSON.Point>[],
    minDistanceInMeters = 10
): GeoJSON.Position | undefined => {
    let p: GeoJSON.Position | undefined;
    for (const { geometry } of features) {
        if (turfDistance(currentPoint, geometry.coordinates, { units: 'meters' }) > minDistanceInMeters) {
            p = geometry.coordinates
            break;
        }
    }
    return p;
};

export const getRouteSourceData = (
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number,
): CurrentPointData => {
    const currentTime = startTimeEpoch + progressMs;
    const splitIndex = geojson.features.findIndex((f) => new Date(f.properties.time).valueOf() > new Date(currentTime).valueOf());
    const { currentPoint, currentPointBearing, currentPointSpeed } = getCurrentPoint(geojson, splitIndex, currentTime);

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
 * Searches for the closest point to a given coordinate using the turf distance metric (Haversine formula).
 * @param lngLat Coordinates for which to find the closest feature.
 * @param geojson Route data to get feature id from.
 * @returns A tuple where the first element is the ID of the closest feature from `geojson`, and second is the feature.
 */
export const getClosestFeature = (
    lngLat: maplibregl.LngLat,
    geojson: GeoJson,
): [number, GeoJSON.Feature<GeoJSON.Point, FeatureProperties>] => {
    const [feature] = geojson.features.reduce<[GeoJSON.Feature<GeoJSON.Point, FeatureProperties>, number]>((acc, val) => {
        const from = turfHelpers.point([lngLat.lng, lngLat.lat]);
        const to = turfHelpers.point(val.geometry.coordinates);
        const distance = turfDistance(from, to, { units: 'meters' });

        return distance < acc[1] ? [val, distance] : acc;
    }, [{
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [0, 0]
        },
        properties: {
            id: -1,
            time: new Date().toISOString()
        }
    }, Infinity]);

    return [feature.properties.id, feature];
};
