import { expect } from "chai";
import { describe, it } from "mocha";
import { defaultRouteStoryState, getRoutePointsLayers, routeLayerIds } from "../src";

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
