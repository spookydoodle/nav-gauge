import { FeatureStateProps } from "@apparatus";
import { RGBColor, Theme } from "@ui";
import { EqualBooleanFeatureState, GetProperty, LineCap } from "./model";
import { RouteStoryLineStyle, RouteStoryState } from "../model";

export const defaultRouteStoryState: RouteStoryState = {
    routeStyleActive: {
        showRouteLine: true,
        showRoutePoints: false,
        color: 'rgb(160, 48, 160)',
        width: 2,
        outlineColor: 'rgb(255, 255, 255)',
        outlineWidth: 1,
        variant: 'solid',
    },
    routeStyleInactive: {
        showRouteLine: true,
        showRoutePoints: false,
        color: 'rgb(221, 160, 221)',
        width: 1,
        outlineColor: 'rgb(255, 255, 255)',
        outlineWidth: 0,
        variant: 'dashed',
    },
    currentPoint: {
        fillColor: 'rgb(160, 48, 160)',
        outlineColor: 'rgb(221, 160, 221)',
        size: 5,
        shape: {
            type: 'simple',
            shape: 'circle',
        },
    },
};

/**
 * Default style colors are derived from the theme's tertiary token, so the "restored"
 * line follows the active theme. The pristine `defaultRouteStoryState` marker is
 * independent of the theme and used to detect untouched state.
 */
export const getDefaultRouteStoryState = (theme: Theme): RouteStoryState => {
    const toCssColor = ({ r, g, b }: RGBColor): string => `rgb(${r}, ${g}, ${b})`;
    const activeColor = toCssColor(theme.colors.tertiary[700]);
    const inactiveColor = toCssColor(theme.colors.tertiary[500]);

    return {
        routeStyleActive: {
            showRouteLine: true,
            showRoutePoints: false,
            color: activeColor,
            width: 2,
            outlineColor: 'rgb(255, 255, 255)',
            outlineWidth: 1,
            variant: 'solid',
        },
        routeStyleInactive: {
            showRouteLine: true,
            showRoutePoints: false,
            color: inactiveColor,
            width: 1,
            outlineColor: 'rgb(255, 255, 255)',
            outlineWidth: 0,
            variant: 'dashed',
        },
        currentPoint: {
            fillColor: activeColor,
            outlineColor: inactiveColor,
            size: 5,
            shape: {
                type: 'simple',
                shape: 'circle',
            },
        },
    };
};

export const routeSourceIds = {
    line: 'route-story-line',
    cameraLine: 'route-story-camera-line',
    currentPoint: 'route-story-current-point',
}

/**
 * Keys follow layer order
 */
export const routeLayerIds = {
    lineActiveOutline: 'route-line-active-outline',
    lineActive: 'route-line-active',
    lineInactiveOutline: 'route-line-inactive-outline',
    lineInactive: 'route-line-inactive',
    pointsActive: 'route-points-active',
    pointsInactive: 'route-points-inactive',
    currentPointOutline: 'route-current-point-outline',
    currentPoint: 'route-current-point',
}

export const routeCameraLayerIds = {
    line: 'route-line-simplified',
    points: 'route-points-simplified',
}

export const currentPointSizeOptions: { label: string; radius: number }[] = [
    { label: 'xs', radius: 3 },
    { label: 'sm', radius: 4 },
    { label: 'md', radius: 5 },
    { label: 'lg', radius: 7 },
    { label: 'xl', radius: 9 },
];

type RouteStatus = 'before' | 'after';
type RouteStatusFilter = ['==', GetProperty, RouteStatus];
type HighlightOrStatusColor = [
    'case',
    EqualBooleanFeatureState, string,
    ['==', GetProperty, RouteStatus], string,
    string
];

export interface RouteLineLayerSpec {
    id: string;
    type: 'line';
    source: string;
    filter?: RouteStatusFilter;
    layout: {
        'line-cap': LineCap;
        'line-join': LineCap;
    };
    paint: {
        'line-color': string;
        'line-width': number;
        'line-opacity': number;
        'line-dasharray'?: number[];
    };
}

export interface RouteCircleLayerSpec {
    id: string;
    type: 'circle';
    source: string;
    filter?: RouteStatusFilter;
    paint: {
        'circle-color': string | HighlightOrStatusColor;
        'circle-radius': number;
    };
}

const statusFilter = (status: RouteStatus): RouteStatusFilter => ['==', ['get', 'status'], status];

const getLinePart = (status: RouteStatus, style: RouteStoryLineStyle, isOutline: boolean): RouteLineLayerSpec => ({
    id: routeLayerIds[
        isOutline
            ? status === 'before' ? 'lineActiveOutline' : 'lineInactiveOutline'
            : status === 'before' ? 'lineActive' : 'lineInactive'
    ],
    type: 'line',
    source: routeSourceIds.line,
    filter: statusFilter(status),
    layout: {
        'line-cap': 'round',
        'line-join': 'round',
    },
    paint: {
        'line-color': isOutline ? style.outlineColor : style.color,
        'line-width': isOutline ? style.width + style.outlineWidth * 2 : style.width,
        'line-opacity': 1,
        ...(style.variant === 'dashed' ? { 'line-dasharray': getLineDashArray(style, isOutline) } : {}),
    },
});

const getLineDashArray = (style: RouteStoryLineStyle, isOutline: boolean): number[] => {
    const dashWidth = isOutline ? style.width + style.outlineWidth * 2 : style.width;

    return [2 * (style.width / dashWidth), 2 * (style.width / dashWidth)];
};

export const getRouteLineLayers = (state: RouteStoryState): (RouteLineLayerSpec | RouteCircleLayerSpec)[] => {
    const layers: (RouteLineLayerSpec | RouteCircleLayerSpec)[] = [];

    if (state.routeStyleActive.showRouteLine) {
        if (state.routeStyleActive.outlineWidth > 0) {
            layers.push(getLinePart('before', state.routeStyleActive, true));
        }
        layers.push(getLinePart('before', state.routeStyleActive, false));
    }
    if (state.routeStyleInactive.showRouteLine) {
        if (state.routeStyleInactive.outlineWidth > 0) {
            layers.push(getLinePart('after', state.routeStyleInactive, true));
        }
        layers.push(getLinePart('after', state.routeStyleInactive, false));
    }

    return layers;
};

export const getRoutePointsLayers = (state: RouteStoryState): RouteCircleLayerSpec[] => {
    const layers: RouteCircleLayerSpec[] = [];

    if (state.routeStyleActive.showRoutePoints) {
        layers.push({
            id: routeLayerIds.pointsActive,
            type: 'circle',
            source: routeSourceIds.line,
            filter: statusFilter('before'),
            paint: {
                'circle-color': [
                    'case',
                    ["==", ["feature-state", FeatureStateProps.Highlight], true],
                    'red',
                    ['==', ['get', 'status'], 'before'],
                    state.routeStyleActive.color,
                    state.routeStyleInactive.color,
                ],
                'circle-radius': 3,
            },
        });
    }
    if (state.routeStyleInactive.showRoutePoints) {
        layers.push({
            id: routeLayerIds.pointsInactive,
            type: 'circle',
            source: routeSourceIds.line,
            filter: statusFilter('after'),
            paint: {
                'circle-color': [
                    'case',
                    ["==", ["feature-state", FeatureStateProps.Highlight], true],
                    'red',
                    ['==', ['get', 'status'], 'before'],
                    state.routeStyleActive.color,
                    state.routeStyleInactive.color,
                ],
                'circle-radius': 3,
            },
        });
    }

    return layers;
};

export const getCurrentPointLayers = (state: RouteStoryState): RouteCircleLayerSpec[] => {
    const radius = state.currentPoint.size;

    return [
        {
            id: routeLayerIds.currentPointOutline,
            type: 'circle',
            source: routeSourceIds.currentPoint,
            paint: {
                'circle-color': state.currentPoint.outlineColor,
                'circle-radius': radius + 2,
            },
        },
        {
            id: routeLayerIds.currentPoint,
            type: 'circle',
            source: routeSourceIds.currentPoint,
            paint: {
                'circle-color': state.currentPoint.fillColor,
                'circle-radius': radius,
            },
        },
    ];
};

export const getCameraLineLayers = (): (RouteLineLayerSpec | RouteCircleLayerSpec)[] => {
    const cameraLineColor = 'green';

    return [
        {
            id: routeCameraLayerIds.line,
            type: 'line',
            source: routeSourceIds.cameraLine,
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': cameraLineColor,
                'line-width': 4,
                'line-opacity': 1,
            },
        },
        {
            id: routeCameraLayerIds.points,
            type: 'circle',
            source: routeSourceIds.cameraLine,
            paint: {
                'circle-color': cameraLineColor,
                'circle-radius': 7,
            },
        },
    ];
};