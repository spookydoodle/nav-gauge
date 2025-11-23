import { AttributionVault } from "./attribution"
import { Cartographer } from "./cartographer";

/**
 * Warden does what warden needs to do.
 */
export class StateWarden {
    public cartographer = new Cartographer();
    public attributionVault = new AttributionVault();

    public constructor() {}
}
