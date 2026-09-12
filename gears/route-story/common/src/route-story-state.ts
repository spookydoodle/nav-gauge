import { defaultRouteStoryState } from "./layer-specification";
import { currentPointIconNames, CurrentPointIconName, RouteStoryState } from "./model";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const mergeKnownFields = <T extends object>(defaults: T, value: unknown): T => {
    const stored = isRecord(value) ? value : {};

    return Object.fromEntries(Object.entries(defaults).map(([key, defaultValue]) => [
        key,
        Object.prototype.hasOwnProperty.call(stored, key) ? stored[key] : defaultValue,
    ])) as T;
};

export const cleanUpRouteStoryState = (value: unknown): RouteStoryState => {
    const stored = isRecord(value) ? value : {};
    const currentPoint = mergeKnownFields(defaultRouteStoryState.currentPoint, stored.currentPoint);

    return {
        routeStyleActive: mergeKnownFields(defaultRouteStoryState.routeStyleActive, stored.routeStyleActive),
        routeStyleInactive: mergeKnownFields(defaultRouteStoryState.routeStyleInactive, stored.routeStyleInactive),
        currentPoint: {
            ...currentPoint,
            icon: currentPointIconNames.includes(currentPoint.icon as CurrentPointIconName) ? currentPoint.icon : 'Circle',
            rotationAlignment: currentPoint.rotationAlignment === 'viewport' ? 'viewport' : 'map',
        },
    };
};
