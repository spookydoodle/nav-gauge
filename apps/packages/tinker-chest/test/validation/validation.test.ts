import { expect } from "chai";
import { describe } from "mocha";
import { validateGaugeControls, validateMapLayout } from "../../src/validation/controls.js";
import { GaugeControlsType, MapLayout } from "../../src/controls/model.js";

describe("Tinker chest", () => {
    describe("Validation", () => {
        describe("Map layout", () => {
            it("should not throw if correct", () => {
                expect(() => validateMapLayout({})).to.not.throw();
            });
            it("should throw if border color incorrect", () => {
                expect(() => validateMapLayout({ borderColor: "#ff0000" })).to.not.throw();
                expect(() => validateMapLayout({ borderColor: 123 } as unknown as MapLayout)).to.throw("Border color should be of type string");
            });
            it("should throw if border radius incorrect", () => {
                expect(() => validateMapLayout({ borderRadius: "50%" })).to.not.throw();
                expect(() => validateMapLayout({ borderRadius: 123 } as unknown as MapLayout)).to.throw("Border radius should be of type string");
            });
            it("should throw if border width incorrect", () => {
                expect(() => validateMapLayout({ borderWidth: 10 })).to.not.throw();
                expect(() => validateMapLayout({ borderWidth: "dcsjkd" } as unknown as MapLayout)).to.throw("Border width should be of type number");
            });
            it("should throw if box shadow incorrect", () => {
                expect(() => validateMapLayout({ boxShadow: "10px 10px red" })).to.not.throw();
                expect(() => validateMapLayout({ boxShadow: true } as unknown as MapLayout)).to.throw("Box shadow should be of type string");
            });
            it("should throw if map size type incorrect", () => {
                expect(() => validateMapLayout({ size: { type: 'manual', height: 12, width: 100, } })).to.not.throw();
                expect(() => validateMapLayout({ size: { type: 'boo' } } as unknown as MapLayout)).to.throw("Size type should be one of: full-screen, manual");
            });
            it("should throw if height incorrect", () => {
                expect(() => validateMapLayout({ size: { type: 'manual', height: 12, width: 100, } })).to.not.throw();
                expect(() => validateMapLayout({ size: { height: true } } as unknown as MapLayout)).to.throw("Height should be of type number");
            });
            it("should throw if inner border color incorrect", () => {
                expect(() => validateMapLayout({ innerBorderColor: "#ff00ff" })).to.not.throw();
                expect(() => validateMapLayout({ innerBorderColor: true } as unknown as MapLayout)).to.throw("Inner border color should be of type string");
            });
            it("should throw if inner border width incorrect", () => {
                expect(() => validateMapLayout({ innerBorderWidth: 5 })).to.not.throw();
                expect(() => validateMapLayout({ innerBorderWidth: true } as unknown as MapLayout)).to.throw("Inner border width should be of type number");
            });
            it("should throw if inner box shadow incorrect", () => {
                expect(() => validateMapLayout({ innerBoxShadow: "1px 1px yellow" })).to.not.throw();
                expect(() => validateMapLayout({ innerBoxShadow: true } as unknown as MapLayout)).to.throw("Inner box shadow should be of type string");
            });
            it("should throw if width incorrect", () => {
                expect(() => validateMapLayout({ size: { type: 'manual', height: 12, width: 100, } })).to.not.throw();
                expect(() => validateMapLayout({ size: { width: true } } as unknown as MapLayout)).to.throw("Width should be of type number");
            });
        });

        describe("Gauge controls", () => {
            it("should not throw if correct", () => {
                expect(() => validateGaugeControls({})).to.not.throw();
            });
            it("should throw if controlPlacement incorrect", () => {
                expect(() => validateGaugeControls({ controlPlacement: { top: 0, bottom: 0, left: 0, right: 0 } })).to.not.throw();
                expect(() => validateGaugeControls({ controlPlacement: true } as unknown as GaugeControlsType)).to.throw("Control placement incorrect");
                expect(() => validateGaugeControls({ controlPlacement: { foo: 'bar' } } as unknown as GaugeControlsType)).to.throw("Control placement missing required keys: top, left, right, bottom");
            });
            it("should throw if controlPosition incorrect", () => {
                expect(() => validateGaugeControls({ controlPosition: "bottom-left" })).to.not.throw();
                expect(() => validateGaugeControls({ controlPosition: {} } as unknown as GaugeControlsType)).to.throw("Control position should be one of: top-left, top-right, bottom-left, bottom-right");
            });
            it("should throw if globeProjection incorrect", () => {
                expect(() => validateGaugeControls({ globeProjection: false })).to.not.throw();
                expect(() => validateGaugeControls({ globeProjection: {} } as unknown as GaugeControlsType)).to.throw("Globe projection should be of type boolean");
            });
            it("should throw if showCompass incorrect", () => {
                expect(() => validateGaugeControls({ showCompass: false })).to.not.throw();
                expect(() => validateGaugeControls({ showCompass: "" } as unknown as GaugeControlsType)).to.throw("Show compass should be of type boolean");
            });
            it("should throw if showGreenScreen incorrect", () => {
                expect(() => validateGaugeControls({ showGreenScreen: false })).to.not.throw();
                expect(() => validateGaugeControls({ showGreenScreen: "" } as unknown as GaugeControlsType)).to.throw("Show green screen should be of type boolean");
            });
            it("should throw if showRouteLine incorrect", () => {
                expect(() => validateGaugeControls({ showRouteLine: false })).to.not.throw();
                expect(() => validateGaugeControls({ showRouteLine: "" } as unknown as GaugeControlsType)).to.throw("Show route line should be of type boolean");
            });
            it("should throw if showRoutePoints incorrect", () => {
                expect(() => validateGaugeControls({ showRoutePoints: false })).to.not.throw();
                expect(() => validateGaugeControls({ showRoutePoints: "" } as unknown as GaugeControlsType)).to.throw("Show route points should be of type boolean");
            });
            it("should throw if showZoomButtons incorrect", () => {
                expect(() => validateGaugeControls({ showZoomButtons: false })).to.not.throw();
                expect(() => validateGaugeControls({ showZoomButtons: "" } as unknown as GaugeControlsType)).to.throw("Show zoom buttons should be of type boolean");
            });
        });
    });
});
