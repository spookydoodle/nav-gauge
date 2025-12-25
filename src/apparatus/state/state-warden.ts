import { Animatrix } from "./animatrix/animatrix";
import { AttributionVault } from "./attribution-vault"
import { Cartomancer } from "./cartomancer";
import { ChronoLens } from "./chrono-lens";
import { Engine } from "./engine";
import { SignaliumBureau } from "./signalium-bureau";

/**
 * Warden does what warden needs to do.
 */
export class StateWarden {
    public signaliumBureau = new SignaliumBureau();
    public animatrix = new Animatrix();
    public chronoLens = new ChronoLens(this.signaliumBureau);
    public attributionVault = new AttributionVault();
    public cartomancer = new Cartomancer();
    public engine = new Engine();

    public constructor() { }
}
