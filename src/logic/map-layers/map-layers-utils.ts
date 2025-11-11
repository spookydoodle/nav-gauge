import maplibregl from "maplibre-gl";
import turfAlong from "@turf/along";
import * as turfHelpers from "@turf/helpers";
import turfLength from "@turf/length";
import { GeoJson, ImageData } from "../parsers";

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
        'line-width': 4,
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
            ['==', ['get', 'status'], 'before'],
            colorActive,
            colorInactive
        ],
        'circle-radius': 3,
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
        "circle-radius": 5
    }
};

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

export const getRouteSourceData = (
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number,
): {
    currentPoint: GeoJSON.Feature<GeoJSON.Point>;
    lines: GeoJSON.GeoJSON;
} => {
    const currentTime = startTimeEpoch + progressMs;
    const splitIndex = geojson.features.findIndex((f) => new Date(f.properties.time).valueOf() > new Date(currentTime).valueOf());
    const currentPoint = getCurrentPoint(geojson, splitIndex, currentTime);

    return {
        currentPoint,
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
