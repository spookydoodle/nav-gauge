import { Animatrix } from "./animatrix";
import { AttributionVault } from "./attribution"
import { Cartomancer } from "./cartomancer";

/**
 * Warden does what warden needs to do.
 */
export class StateWarden {
    public cartomancer = new Cartomancer();
    public animatrix = new Animatrix();
    public attributionVault = new AttributionVault();

    public constructor() { }
}
