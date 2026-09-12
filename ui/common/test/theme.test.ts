import { expect } from "chai";
import { Theme } from "../src";

describe("Theme", () => {
    it("orders global layers semantically", () => {
        expect(Theme.zIndex.hudConnector).to.be.lessThan(Theme.zIndex.popup);
        expect(Theme.zIndex.popup).to.be.lessThan(Theme.zIndex.floating);
        expect(Theme.zIndex.floating).to.be.lessThan(Theme.zIndex.tooltipConnector);
        expect(Theme.zIndex.tooltipConnector).to.be.lessThan(Theme.zIndex.tooltip);
    });
});
