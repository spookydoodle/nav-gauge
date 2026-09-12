import { expect } from "chai";
import { describe, it } from "mocha";
import { addDecimalStep } from "../src/number-input";

describe("addDecimalStep", () => {
    it("normalizes fractional steps", () => {
        expect(addDecimalStep(1.3, 0.1)).to.equal(1.4);
        expect(addDecimalStep(1.4, -0.1)).to.equal(1.3);
    });
});
