import { expect } from "chai";
import { describe } from "mocha";
import { AnimationControlsType } from "../../src/state/animatrix/model.js";
import { Animatrix } from "../../src/state/animatrix/animatrix.js";

describe("Apparatus", () => {
    describe("Validation", () => {
        describe("Animation controls", () => {
            it("should throw if followCurrentPoint incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ followCurrentPoint: false })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ followCurrentPoint: "" } as unknown as AnimationControlsType)).to.throw("Follow current point should be of type boolean");
            });
            it("should throw if autoRotate incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ autoRotate: false })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ autoRotate: "" } as unknown as AnimationControlsType)).to.throw("Auto rotate should be of type boolean");
            });
            it("should throw if bearingLineLengthInMeters incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ bearingLineLengthInMeters: 1000 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ bearingLineLengthInMeters: 100001 } as unknown as AnimationControlsType)).to.throw("Bearing line length in meters should be within range [0, 100000]");
                expect(() => Animatrix.validateAnimationControls({ bearingLineLengthInMeters: "" } as unknown as AnimationControlsType)).to.throw("Bearing line length in meters should be of type number");
            });
            it("should throw if maxBearingDiffPerFrame incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ maxBearingDiffPerFrame: 1 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ maxBearingDiffPerFrame: 370 } as unknown as AnimationControlsType)).to.throw("Max bearing diff per frame should be within range [0, 360]");
                expect(() => Animatrix.validateAnimationControls({ maxBearingDiffPerFrame: "" } as unknown as AnimationControlsType)).to.throw("Max bearing diff per frame should be of type number");
            });
            it("should throw if cameraAngle incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ cameraAngle: -90 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ cameraAngle: 2000000 } as unknown as AnimationControlsType)).to.throw("Camera angle should be within range [-360, 360]");
                expect(() => Animatrix.validateAnimationControls({ cameraAngle: "" } as unknown as AnimationControlsType)).to.throw("Camera angle should be of type number");
            });
            it("should throw if cameraRoll incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ cameraRoll: -90 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ cameraRoll: 2000000 } as unknown as AnimationControlsType)).to.throw("Camera roll should be within range [-360, 360]");
                expect(() => Animatrix.validateAnimationControls({ cameraRoll: "" } as unknown as AnimationControlsType)).to.throw("Camera roll should be of type number");
            });
            it("should throw if pitch incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ pitch: 20 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ pitch: 200 } as unknown as AnimationControlsType)).to.throw("Pitch should be within range [0, 85]");
                expect(() => Animatrix.validateAnimationControls({ pitch: "" } as unknown as AnimationControlsType)).to.throw("Pitch should be of type number");
            });
            it("should throw if showZoom incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ zoom: 13 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ zoom: 200 } as unknown as AnimationControlsType)).to.throw("Zoom should be within range [0, 20]");
                expect(() => Animatrix.validateAnimationControls({ zoom: "" } as unknown as AnimationControlsType)).to.throw("Zoom should be of type number");
            });
            it("should throw if zoomInToImages incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ zoomInToImages: false })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ zoomInToImages: 15 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ zoomInToImages: true } as unknown as AnimationControlsType)).to.throw("Zoom in to images should be either false or of type number within range [0, 20]");
                expect(() => Animatrix.validateAnimationControls({ zoomInToImages: 200 } as unknown as AnimationControlsType)).to.throw("Zoom in to images should be within range [0, 20]");
                expect(() => Animatrix.validateAnimationControls({ zoomInToImages: "" } as unknown as AnimationControlsType)).to.throw("Zoom in to images should be either false or of type number within range [0, 20]");
            });
            it("should throw if displayImageDuration incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ displayImageDuration: 4500 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ displayImageDuration: 2000000 } as unknown as AnimationControlsType)).to.throw("Image pause duration should be within range [0, 10000]");
                expect(() => Animatrix.validateAnimationControls({ displayImageDuration: -1000 } as unknown as AnimationControlsType)).to.throw("Image pause duration should be within range [0, 10000]");
                expect(() => Animatrix.validateAnimationControls({ displayImageDuration: "" } as unknown as AnimationControlsType)).to.throw("Image pause duration should be of type number");
            });
            it("should throw if speed incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ speedMultiplier: 120 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ speedMultiplier: 2000000 } as unknown as AnimationControlsType)).to.throw("Speed in seconds per frame should be within range [0, 1000000]");
                expect(() => Animatrix.validateAnimationControls({ speedMultiplier: "" } as unknown as AnimationControlsType)).to.throw("Speed in seconds per frame should be of type number");
            });
            it("should throw if easeDuration incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ easeDuration: 200 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ easeDuration: 1234 } as unknown as AnimationControlsType)).to.throw("Ease duration should be within range [0, 1000]");
                expect(() => Animatrix.validateAnimationControls({ easeDuration: -10 } as unknown as AnimationControlsType)).to.throw("Ease duration should be within range [0, 1000]");
                expect(() => Animatrix.validateAnimationControls({ easeDuration: "" } as unknown as AnimationControlsType)).to.throw("Ease duration should be of type number");
            });
        });
    });
});
