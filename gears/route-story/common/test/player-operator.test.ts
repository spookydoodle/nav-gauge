import { expect } from "chai";
import { describe, it } from "mocha";
import { easeHeading, unwrapHeading } from "../src/player-operator";

describe("route heading", () => {
    it("unwraps across north by the shortest angle", () => {
        expect(unwrapHeading(359, 1)).to.equal(361);
        expect(unwrapHeading(1, 359)).to.equal(-1);
    });

    it("eases using frame time and snaps when easing is disabled", () => {
        expect(easeHeading(0, 90, 250, 1000)).to.equal(22.5);
        expect(easeHeading(0, 90, 250, 0)).to.equal(90);
    });
});
