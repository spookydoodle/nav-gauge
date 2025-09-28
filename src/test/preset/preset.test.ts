import { expect } from "chai";
import { describe } from "mocha";
import { validateMapLayout } from "../../nav-gauge/controls/validation.js";
import { MapLayout } from "../../nav-gauge/controls/MapLayoutControls.js";

describe("Preset", () => {
    describe("File upload validation", () => {
        it("should not throw if correct", () => {
            expect(() => validateMapLayout({})).to.not.throw
        });
        it("should throw if border color incorrect", () => {
            expect(() => validateMapLayout({ borderColor: "#ff0000" })).to.not.throw("Border color should be of type string")
            expect(() => validateMapLayout({ borderColor: 123 } as unknown as MapLayout)).to.throw("Border color should be of type string")
        });
        it("should throw if border radius incorrect", () => {
            expect(() => validateMapLayout({ borderRadius: "50%" } )).to.not.throw("Border color should be of type string")
            expect(() => validateMapLayout({ borderRadius: 123 } as unknown as MapLayout)).to.throw("Border radius should be of type string")
        });
        it("should throw if border width incorrect", () => {
            expect(() => validateMapLayout({ borderWidth: 10 } )).to.not.throw("Border width should be of type number")
            expect(() => validateMapLayout({ borderWidth: "dcsjkd" } as unknown as MapLayout)).to.throw("Border width should be of type number")
        });
        it("should throw if box shadow incorrect", () => {
            expect(() => validateMapLayout({ boxShadow: "10px 10px red" } )).to.not.throw("Box shadow should be of type string")
            expect(() => validateMapLayout({ boxShadow: true } as unknown as MapLayout)).to.throw("Box shadow should be of type string")
        });
        it("should throw if height incorrect", () => {
            expect(() => validateMapLayout({ height: 12 } )).to.not.throw("Height should be of type number")
            expect(() => validateMapLayout({ height: true } as unknown as MapLayout)).to.throw("Height should be of type number")
        });
        it("should throw if inner border color incorrect", () => {
            expect(() => validateMapLayout({ innerBorderColor: "#ff00ff" } )).to.not.throw("Inner border color should be of type string")
            expect(() => validateMapLayout({ innerBorderColor: true } as unknown as MapLayout)).to.throw("Inner border color should be of type string")
        });
        it("should throw if inner border width incorrect", () => {
            expect(() => validateMapLayout({ innerBorderWidth: 5 } )).to.not.throw("Inner border width should be of type number")
            expect(() => validateMapLayout({ innerBorderWidth: true } as unknown as MapLayout)).to.throw("Inner border width should be of type number")
        });
        it("should throw if inner border width incorrect", () => {
            expect(() => validateMapLayout({ innerBoxShadow: "1px 1px yellow" } )).to.not.throw("Inner box shadow should be of type string")
            expect(() => validateMapLayout({ innerBoxShadow: true } as unknown as MapLayout)).to.throw("Inner box shadow should be of type string")
        });
        it("should throw if width incorrect", () => {
            expect(() => validateMapLayout({ width: 20 } )).to.not.throw("Width should be of type number")
            expect(() => validateMapLayout({ width: true } as unknown as MapLayout)).to.throw("Width should be of type number")
        });
    });
});
