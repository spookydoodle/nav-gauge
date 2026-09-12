import { expect } from "chai";
import { describe, it } from "mocha";
import { cleanUpRouteStoryState, defaultRouteStoryState } from "../src";

describe("cleanUpRouteStoryState", () => {
    it("merges nested defaults, preserves saved fields, and rejects invalid icons", () => {
        const state = cleanUpRouteStoryState({
            routeStyleActive: { color: 'saved', pointColor: 'saved-point', obsolete: true },
            currentPoint: { fillColor: 'saved-fill', icon: 'Missing', rotationAlignment: 'viewport', outlineColor: 'obsolete', outlineWidth: 9, shape: 'obsolete' },
            obsolete: true,
        });

        expect(state).to.deep.equal({
            ...defaultRouteStoryState,
            routeStyleActive: {
                ...defaultRouteStoryState.routeStyleActive,
                color: 'saved',
                pointColor: 'saved-point',
            },
            currentPoint: {
                ...defaultRouteStoryState.currentPoint,
                fillColor: 'saved-fill',
                icon: 'Circle',
                rotationAlignment: 'viewport',
            },
        });
    });
});
