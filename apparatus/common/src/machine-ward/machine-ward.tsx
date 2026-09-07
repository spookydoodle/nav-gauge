import { ReactElement } from "react";
import { pairwise, Subscription } from "rxjs";
import { MachineWardApp } from "./MachineWardApp";
import { Individuator } from "./individuator";
import { ChronoLens } from "./chrono-lens";
import { AttributionVault, Cartomancer, SignaliumBureau, ToolsStation, Translatron } from "..";
import { Engine } from "./engine";
import { Gear } from "./gears";
import { StorageKeeper } from "./storage-keeper";
import { MachineGear, MachineTranslationKey, MachineWardComponents } from "./model";
import { TranslationTable } from "./translatron";
import { MediaSubscriptionDefinition } from "@ui";
import * as Translations from "./translations";

/**
 * Ward with machines. 
 * 
 * Describes the expected content of the applications and renders complete app.
 */
export abstract class MachineWard<TMap = unknown, TChronoLens extends ChronoLens = ChronoLens, TNavigationPath extends string = string> {
    public title = 'nav gauge';

    private readonly isDev: boolean;
    public readonly namespace = 'machine-ward';
    public readonly translations: TranslationTable<MachineTranslationKey> = Translations;
    public readonly translationKey = MachineTranslationKey;

    public readonly individuator: Individuator;
    public readonly storageKeeper: StorageKeeper;
    public readonly engine = new Engine<TMap, TChronoLens>();
    public readonly attributionVault = new AttributionVault();
    public readonly signaliumBureau = new SignaliumBureau();
    public readonly translatron = new Translatron();
    public readonly cartomancer: Cartomancer<TMap>;
    public readonly chronoLens: TChronoLens;
    public readonly toolsStation = new ToolsStation<TMap>();

    private attributionVaultSubscription: Subscription | null = null;

    public constructor(
        gears: MachineGear<TMap, TChronoLens>[],
        chronoLens: new (individuator: Individuator) => TChronoLens,
        storage: StorageLike,
        isDev: boolean,
        protected media: MediaSubscriptionDefinition
    ) {
        this.isDev = isDev;
        this.translatron.register(this.namespace, this.translations);

        this.storageKeeper = new StorageKeeper(storage);
        this.individuator = new Individuator(isDev);
        this.cartomancer = new Cartomancer();
        this.chronoLens = new chronoLens(this.individuator);

        this.engine.addGears(
            gears.reduce<Gear<TMap, TChronoLens>[]>((acc, Gear) => {
                if (Gear) {
                    acc.push(new Gear({
                        individuator: this.individuator,
                        storageKeeper: this.storageKeeper,
                        signaliumBureau: this.signaliumBureau,
                        attributionVault: this.attributionVault,
                        chronoLens: this.chronoLens,
                        cartomancer: this.cartomancer,
                        toolsStation: this.toolsStation,
                        translatron: this.translatron,
                    }));
                }
                return acc;
            }, [])
        );
    }

    private gearsSubscription: Subscription | null = null

    private initializeValves = () => {
        this.engine.openValves(this.engine.gears$.value);
        this.gearsSubscription = this.engine.gears$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                this.engine.closeValves(prev);
                this.engine.openValves(next);
            });
    };

    private mount = () => {
        this.individuator.initialize(this.storageKeeper, this.translatron);
        this.attributionVaultSubscription = this.subscribeAttributionVault();
        this.cartomancer.initialize(this.storageKeeper, this.translatron, this.toolsStation);
        this.initializeValves();
    };

    public unmount = () => {
        this.gearsSubscription?.unsubscribe();
        this.cartomancer.cleanUp();
        this.attributionVaultSubscription?.unsubscribe();
        this.individuator.cleanUp();
        this.toolsStation.cleanUp();
    };

    private subscribeAttributionVault = (): Subscription => {
        const addEntry = (styleId: keyof typeof Cartomancer.styles) => {
            const style = Cartomancer.styles[styleId];
            if (!style?.attribution) {
                return;
            }
            this.attributionVault.addEntry(styleId, style.attribution);
        };

        addEntry(this.cartomancer.selectedStyle$.value.id);

        return this.cartomancer.selectedStyle$
            .pipe(pairwise())
            .subscribe(([prev, next]) => {
                this.attributionVault.removeEntry(prev.id);
                addEntry(next.id);
            });
    };

    /**
     * Routing and navigation between aplication views
     */
    public abstract navigate: (path: TNavigationPath) => void;

    /**
     * Routing and navigation back
     */
    public abstract navigateBack: () => void;

    public abstract components: MachineWardComponents<TNavigationPath>;

    public render = (): ReactElement => {
        return (
            <MachineWardApp
                isDev={this.isDev}
                namespace={this.namespace}
                title={this.title}
                media={this.media}
                individuator={this.individuator}
                storageKeeper={this.storageKeeper}
                signaliumBureau={this.signaliumBureau}
                attributionVault={this.attributionVault}
                cartomancer={this.cartomancer}
                chronoLens={this.chronoLens}
                toolsStation={this.toolsStation}
                translatron={this.translatron}
                engine={this.engine}
                components={this.components}
                onMount={this.mount}
                onUnmount={this.unmount}
                onNavigate={this.navigate}
                onNavigateBack={this.navigateBack}
            />
        );
    }
}
