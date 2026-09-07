import { describe } from "mocha";
import { expect } from "chai";
import { getRouteSourceData, getSplineData, getSplineHeading } from "../src/tinkers";
import { GeoJson } from "@tinker-chest";
import { RouteStoryState } from "../src";
const route: GeoJson = {
    type: "FeatureCollection",
    features: [
        { type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: { id: 1, time: "2026-01-01T00:00:00Z" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [1, 1] }, properties: { id: 2, time: "2026-01-01T00:01:00Z" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [2, 2] }, properties: { id: 3, time: "2026-01-01T00:02:00Z" } },
    ],
};

const state: RouteStoryState = {
    routeStyleActive: {
        showRouteLine: true,
        showRoutePoints: false,
        color: 'red',
        width: 2,
        outlineColor: 'black',
        outlineWidth: 0,
        variant: 'solid',
    },
    routeStyleInactive: {
        showRouteLine: true,
        showRoutePoints: false,
        color: 'red',
        width: 1,
        outlineColor: 'black',
        outlineWidth: 0,
        variant: 'dashed',
    },
    currentPoint: {
        fillColor: 'blue',
        outlineColor: 'black',
        size: 5,
        shape: {
            type: 'simple',
            shape: 'circle',
        }
    }
};
const startTimeEpoch = Date.parse("2026-01-01T00:00:00Z");

describe("Route story gear", () => {
    describe("Route source data", () => {
        const expectValidLines = (progressMs: number) => {
            const { line } = getRouteSourceData(state, route, startTimeEpoch, progressMs);
            expect(line.type).to.equal("FeatureCollection");
            for (const feature of (line as GeoJSON.FeatureCollection).features) {
                if (feature.geometry.type === "LineString") {
                    expect(feature.geometry.coordinates.length).to.be.greaterThan(1);
                }
            }
        };

        it("should produce no single-point line at route start", () => {
            expectValidLines(0);
        });

        it("should produce two valid lines mid-route", () => {
            const { line } = getRouteSourceData(state, route, startTimeEpoch, 90_000);
            const lineStrings = (line as GeoJSON.FeatureCollection).features
                .filter((f): f is GeoJSON.Feature<GeoJSON.LineString> => f.geometry.type === "LineString");
            expect(lineStrings).to.have.lengthOf(2);
            expect(lineStrings[0].geometry.coordinates.length).to.be.greaterThan(1);
            expect(lineStrings[1].geometry.coordinates.length).to.be.greaterThan(1);
        });

        it("should report the index of the segment that follows the current time", () => {
            const { splitIndex } = getRouteSourceData(state, route, startTimeEpoch, 90_000);
            expect(splitIndex).to.equal(2);
        });
    });

    describe("Spline heading", () => {
        it("should follow the route direction for a straight north-east route", () => {
            const splineData = getSplineData(route);
            const heading = getSplineHeading(splineData, 2, 0.5);
            expect(heading).to.be.closeTo(45, 1);
        });
    });
});
