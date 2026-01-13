import { FeatureStateProps, IMAGE_SIZE } from "@apparatus";
import { Theme } from "@ui";
import { getImageIconSize } from "./tinkers";

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
    images: 'route-images',
    imagesHighlight: 'route-images-highlight',
    imagesHighlightOutline: 'route-images-highlight-outline',
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

const IMAGE_PROPERTY = 'image';
const CIRCLE_RADIUS = 25;

export type ImageFeature = GeoJSON.Feature<GeoJSON.Point, ImageFeatureProperties>;
export interface ImageFeatureProperties {
    imageId: number;
    [IMAGE_PROPERTY]: string;
}

// TODO: Depoendent on base map style
export const getImagesLayers = (theme: Theme): maplibregl.LayerSpecification[] => {
    const imageLayer: maplibregl.SymbolLayerSpecification = {
        id: layerIds.images,
        source: sourceIds.image,
        type: 'symbol',
        layout: {
            'icon-image': ['get', IMAGE_PROPERTY],
            'icon-size': getImageIconSize(IMAGE_SIZE, CIRCLE_RADIUS * 2),
            'icon-allow-overlap': true,
        },
        paint: {
            'icon-opacity': [
                'case',
                ["==", ["feature-state", FeatureStateProps.Dragging], true],
                0.5,
                1
            ]
        }
    };

    return [
        imageLayer,
        {
            id: layerIds.imagesHighlightOutline,
            source: sourceIds.image,
            type: 'circle',
            layout: {},
            paint: {
                'circle-color': 'transparent',
                'circle-stroke-color': 'white',
                'circle-stroke-width': 2,
                "circle-radius": CIRCLE_RADIUS,
                'circle-stroke-opacity': [
                    'case',
                ["==", ["feature-state", FeatureStateProps.Dragging], true],
                0.5,
                    ["==", ["feature-state", FeatureStateProps.Highlight], true],
                    1,
                    0
                ]
            }
        },
        {
            ...imageLayer,
            id: layerIds.imagesHighlight,
            paint: {
                'icon-opacity': [
                    'case',
                ["==", ["feature-state", FeatureStateProps.Dragging], true],
                0.5,
                    ["==", ["feature-state", FeatureStateProps.Highlight], true],
                    1,
                    0
                ]
            }
        },
    ];
}
