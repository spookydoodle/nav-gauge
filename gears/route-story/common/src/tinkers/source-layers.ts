
import turfAlong from "@turf/along";
import turfBearing from "@turf/bearing";
import turfDistance from "@turf/distance";
import { point as turfPoint, lineString as turfLine } from "@turf/helpers";
import { bezierSpline } from "@turf/bezier-spline";
import turfLength from "@turf/length";
import { CurrentPointData, LoadedImageData } from "@apparatus";
import { emptyCollection, FeatureProperties, GeoJson } from "@tinker-chest";
import { RouteStoryState, RouteTimes } from "../model";

export const getRouteSourceData = (
    { routeStyleActive, routeStyleInactive }: RouteStoryState,
    geojson: GeoJson,
    startTimeEpoch: number,
    progressMs: number,
): CurrentPointData => {
    const currentTime = startTimeEpoch + progressMs;
    const splitIndex = geojson.features.findIndex((f) =>
        new Date(f.properties.time).valueOf() > new Date(currentTime).valueOf()
    );
    const { currentPoint, fraction } = getCurrentPoint(geojson, splitIndex, currentTime);

    const anyVisible =
        routeStyleActive.showRouteLine || routeStyleActive.showRoutePoints ||
        routeStyleInactive.showRouteLine || routeStyleInactive.showRoutePoints;

    return {
        splitIndex,
        fraction,
        currentPoint,
        line: anyVisible
            ? {
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
                ].filter((feature) => feature.geometry.coordinates.length > 1) as GeoJSON.Feature<GeoJSON.LineString>[]
            }
            : emptyCollection,
    };
};

/**
 * @returns current point feature interpolated between the first features before/after it, plus the fractional position between them.
 */
const getCurrentPoint = (
    geojson: GeoJson,
    splitIndex: number,
    currentTime: number,
): {
    currentPoint: GeoJSON.Feature<GeoJSON.Point>;
    fraction: number;
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
    const currentPoint = { ...currentLineEnd };

    if (!('featureId' in currentPoint.properties)) {
        currentPoint.geometry = turfAlong(line, totalDistanceMeters * fraction, { units: 'meters' }).geometry;
    };

    return {
        currentPoint,
        fraction,
    };
};

export interface SplineData {
    spline: GeoJSON.Feature<GeoJSON.LineString>;
    lookup: Array<{ t: number }>;
    splinePoints: GeoJSON.Position[];
}

export const getSplineData = (geojson: GeoJson): SplineData => {
    const features = geojson.features;
    const spline = bezierSpline({
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: features.map((f) => f.geometry.coordinates)
        },
        properties: {}
    }, { resolution: 500 });
    const splinePoints = spline.geometry.coordinates;

    const lookup = buildSplineLookup(features, splinePoints);

    return { spline, lookup, splinePoints };
};

const buildSplineLookup = (
    features: GeoJson['features'],
    splinePoints: GeoJSON.Position[],
): Array<{ t: number }> => {
    const origCumulative = [0];
    for (let i = 1; i < features.length; i++) {
        origCumulative.push(
            origCumulative[i - 1] + turfDistance(
                features[i - 1].geometry.coordinates,
                features[i].geometry.coordinates,
                { units: 'meters' },
            )
        );
    }
    const origTotal = origCumulative[origCumulative.length - 1];

    const splineCumulative = [0];
    for (let i = 1; i < splinePoints.length; i++) {
        splineCumulative.push(
            splineCumulative[i - 1] + turfDistance(splinePoints[i - 1], splinePoints[i], { units: 'meters' })
        );
    }
    const splineTotal = splineCumulative[splineCumulative.length - 1];

    return features.map((_feature, i) => {
        const fraction = origTotal > 0 ? origCumulative[i] / origTotal : 0;
        const targetDistance = fraction * splineTotal;
        let bestIdx = 0;

        for (let j = 1; j < splineCumulative.length; j++) {
            if (splineCumulative[j] >= targetDistance) {
                bestIdx = j;
                break;
            }
            bestIdx = j;
        }

        return { t: bestIdx / (splinePoints.length - 1) };
    });
};

export const getSplineHeading = (splineData: SplineData, splitIndex: number, fraction: number): number => {
    const { lookup, splinePoints } = splineData;
    const t1 = lookup[Math.max(0, splitIndex - 1)].t;
    const t2 = lookup[Math.min(lookup.length - 1, splitIndex)].t;
    const t = t1 + (t2 - t1) * fraction;
    const splineIdx = Math.min(splinePoints.length - 2, Math.max(1, Math.round(t * (splinePoints.length - 1))));

    return turfBearing(
        turfPoint(splinePoints[splineIdx - 1]),
        turfPoint(splinePoints[splineIdx]),
    );
};

export function getIconImageId<TImageData>(
    imageData: LoadedImageData<TImageData>,
    { thumbnail }: { thumbnail?: boolean } = {}
): string {
    return `image-${imageData.id}${thumbnail ? '-thumbnail' : ''}`;
}

export const getPosition = (
    featureId: number | undefined,
    geojson: GeoJson | undefined,
    routeTimes: RouteTimes | null,
) => {
    const feature = geojson?.features.find((feature) => feature.properties.id === featureId);
    if (!feature || !routeTimes) {
        return 0;
    }
    return (new Date(feature.properties.time).valueOf() - new Date(routeTimes.startTime).valueOf()) / routeTimes.duration * 100;
};

export const getClosestFeatureFromPosition = (
    positionPercent: number,
    geojson: GeoJson | undefined,
    routeTimes: RouteTimes | null,
): GeoJSON.Feature<GeoJSON.Point, FeatureProperties> | null => {
    if (!geojson || !routeTimes) {
        return null;
    }
    let closestFeature: GeoJSON.Feature<GeoJSON.Point, FeatureProperties> | null = null;
    let closestDistance = Infinity;

    for (const feature of geojson.features) {
        const featureTime = new Date(feature.properties.time).valueOf();
        const featurePercent = (featureTime - new Date(routeTimes.startTime).valueOf()) / routeTimes.duration * 100;
        const distance = Math.abs(featurePercent - positionPercent);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestFeature = feature;
        }
    }

    return closestFeature;
};
