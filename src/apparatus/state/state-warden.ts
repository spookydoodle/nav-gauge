import { Animatrix } from "./animatrix";
import { AttributionVault } from "./attribution-vault"
import { Cartomancer } from "./cartomancer";
import { ChronoLens } from "./chrono-lens";
import { Engine } from "./engine";

/**
 * Warden does what warden needs to do.
 */
export class StateWarden {
    public animatrix = new Animatrix();
    public chronoLens = new ChronoLens();
    public attributionVault = new AttributionVault();
    public cartomancer = new Cartomancer();
    public engine = new Engine();

    public constructor() { }
}
