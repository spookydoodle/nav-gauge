import { describe, it } from "mocha";
import { expect } from "chai";
import { placePopup } from "../src/menu/utils";

describe("placePopup", () => {
    it("keeps the desired anchor when the popup fits", () => {
        const result = placePopup("bottom-left", { x: 100, y: 100 }, { width: 100, height: 80 }, 800, 600);

        expect(result.popupAnchor).to.equal("bottom-left");
        expect(result.position).to.deep.equal({ bottom: 500, left: 100 });
    });

    it("flips vertically when the popup overflows the bottom edge", () => {
        const result = placePopup("top-left", { x: 100, y: 580 }, { width: 100, height: 80 }, 800, 600);

        expect(result.popupAnchor).to.equal("bottom-left");
        expect(result.position).to.deep.equal({ bottom: 20, left: 100 });
    });

    it("flips horizontally when the popup overflows the right edge", () => {
        const result = placePopup("top-left", { x: 750, y: 100 }, { width: 200, height: 80 }, 800, 600);

        expect(result.popupAnchor).to.equal("top-right");
        expect(result.position).to.deep.equal({ top: 100, right: 50 });
    });

    it("flips both axes when the popup overflows both edges", () => {
        const result = placePopup("top-left", { x: 750, y: 580 }, { width: 200, height: 80 }, 800, 600);

        expect(result.popupAnchor).to.equal("bottom-right");
        expect(result.position).to.deep.equal({ bottom: 20, right: 50 });
    });

    it("keeps the desired anchor when the popup size is unknown", () => {
        const result = placePopup("top-right", { x: 10, y: 10 }, null, 800, 600);

        expect(result.popupAnchor).to.equal("top-right");
        expect(result.position).to.deep.equal({ top: 10, right: 790 });
    });

    it("uses the top-left corner only while the popup is as wide as the viewport", () => {
        const narrowResult = placePopup("top-right", { x: 500, y: 100 }, { width: 320, height: 80 }, 320, 600);
        const wideResult = placePopup("top-right", { x: 500, y: 100 }, { width: 320, height: 80 }, 800, 600);

        expect(narrowResult.position).to.deep.equal({ top: 0, left: 0 });
        expect(wideResult.position).to.deep.equal({ top: 100, right: 300 });
    });
});
