import { expect } from "chai";
import { describe, it } from "mocha";
import { defaultRouteStoryState, getCurrentPointLayers, getRoutePointsLayers, routeLayerIds } from "../src";

describe("Route point layers", () => {
    it("uses each route part's point color and radius", () => {
        const layers = getRoutePointsLayers({
            ...defaultRouteStoryState,
            routeStyleActive: {
                ...defaultRouteStoryState.routeStyleActive,
                showRoutePoints: true,
                pointColor: 'red',
                pointRadius: 4,
            },
            routeStyleInactive: {
                ...defaultRouteStoryState.routeStyleInactive,
                showRoutePoints: true,
                pointColor: 'blue',
                pointRadius: 6,
            },
        });

        expect(layers.map((layer) => [layer.id, layer.paint['circle-color'], layer.paint['circle-radius']])).to.deep.equal([
            [routeLayerIds.pointsActive, ['case', ['==', ['feature-state', 'highlight'], true], 'red', ['==', ['get', 'status'], 'before'], 'red', 'blue'], 4],
            [routeLayerIds.pointsInactive, ['case', ['==', ['feature-state', 'highlight'], true], 'red', ['==', ['get', 'status'], 'before'], 'red', 'blue'], 6],
        ]);
    });
});

describe("Current point layer", () => {
    it("uses one SDF symbol layer", () => {
        const [layer] = getCurrentPointLayers({
            ...defaultRouteStoryState,
            currentPoint: {
                fillColor: 'red',
                outlineColor: 'blue',
                outlineWidth: 3,
                size: 1.5,
                icon: 'AeroplaneTop01',
            },
        });

        expect(layer).to.deep.equal({
            id: routeLayerIds.currentPoint,
            type: 'symbol',
            source: 'route-story-current-point',
            layout: {
                'icon-image': 'route-current-point-AeroplaneTop01',
                'icon-size': 1.5,
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
            },
            paint: {
                'icon-color': 'red',
                'icon-halo-color': 'blue',
                'icon-halo-width': 3,
            },
        });
    });
});
