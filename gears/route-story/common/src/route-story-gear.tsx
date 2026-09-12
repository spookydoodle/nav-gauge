import { ComponentType, FC } from "react";
import { BehaviorSubject, combineLatest, Subscription } from "rxjs";
import {
    ToolPanelProps,
    MarkerImage,
    OverlayComponentProps,
    Gear,
    TranslationTable,
    GearTranslationKey,
    Cartomancer,
    MapLayout,
    GaugeControlsType,
    GearApparatus,
    TopToolsProps,
    ChronoLens,
    ToolPopupProps,
} from "@apparatus";
import { GeoJson, ParsingResultWithError } from "@tinker-chest";
import { RouteStoryProps, RouteTimes, RouteStoryFile, RouteStoryTranslationKey, RouteStoryState, PresetOption, Preset, RouteStoryLayerStylingPopupProps } from "./model";
import { FileOperator } from "./file-operator";
import { PlayerOperator } from "./player-operator";
import { getSplineData, SplineData } from "./tinkers";
import { Icons } from "@ui";
import * as Translations from "./translations";
import { AnimationControlsType, Animatrix } from "./animatrix";
import { defaultRouteStoryState } from "./layer-specification";
import { cleanUpRouteStoryState } from "./route-story-state";

export abstract class RouteStoryGear<TMap, TChronoLens extends ChronoLens, TFile extends RouteStoryFile, TImageData> extends Gear<TMap, TChronoLens> {
    public readonly id = 'route-story';
    public translations: TranslationTable<GearTranslationKey | RouteStoryTranslationKey> = Translations;
    public internalTranslationKey = RouteStoryTranslationKey;

    public icon = Icons.NounProject.PinCinema as unknown as string;

    public animatrix = new Animatrix();
    private dataSubscription: Subscription | null = null;
    private stateStorageSubscription: Subscription | null = null;
    public readonly data$ = new BehaviorSubject<ParsingResultWithError>({});
    public readonly splineData$ = new BehaviorSubject<SplineData | null>(null);
    public readonly state$ = new BehaviorSubject<RouteStoryState>(defaultRouteStoryState);
    public readonly routeTimes$ = new BehaviorSubject<RouteTimes | null>(null);
    public readonly images$ = new BehaviorSubject<MarkerImage<TImageData>[]>([]);
    public readonly progressMs$ = new BehaviorSubject(0);

    /**
     * Update of a preset will trigger control state update to predefined values which user can later further configure.
     */
    public preset$: BehaviorSubject<Preset>;

    public constructor(apparatus: GearApparatus<TMap, TChronoLens>) {
        super(apparatus);

        const initialPreset = RouteStoryGear.detectPreset(
            apparatus.cartomancer.mapLayout$.value,
            apparatus.cartomancer.gaugeControls$.value,
        );
        this.preset$ = new BehaviorSubject<Preset>(initialPreset || 'default');
    }

    private presetSubscription: Subscription | null = null;
    private presetActiveSubscription: Subscription | null = null;

    public abstract fitBounds: (map: TMap, sw: [number, number], ne: [number, number]) => void;
    public abstract fileToText: (file: TFile,) => Promise<string>;
    public abstract readImage: (file: TFile, geojson?: GeoJson) => Promise<void>;
    public abstract onCleanupStory: (data: ParsingResultWithError, images: MarkerImage<TImageData>[]) => Promise<void>;

    public engageRouteStory?: () => void;
    public disengageRouteStory?: () => void;

    private subscribeToDataUpdates = (): Subscription => {
        return this.data$.subscribe(({ geojson }) => {
            this.progressMs$.next(0);
            this.splineData$.next(geojson ? getSplineData(geojson) : null);

            if (!geojson?.features[0]) {
                this.routeTimes$.next(null);

                return;
            }

            const startTime = geojson.features[0].properties.time;
            const endTime = geojson.features.slice(-1)[0]?.properties.time;
            const startTimeEpoch = new Date(startTime).valueOf();
            const endTimeEpoch = new Date(endTime).valueOf();

            this.routeTimes$.next({
                startTime,
                endTime,
                startTimeEpoch,
                endTimeEpoch,
                duration: endTimeEpoch - startTimeEpoch
            });
        });
    };

    public recTopBarToolId = 'rec';
    public abstract topBarChipComponent: ComponentType<RouteStoryProps<TMap, TChronoLens, TFile, TImageData>>;

    private routeNameToolId = 'route-upload';
    public abstract routeUploadComponent: ComponentType<TopToolsProps<TMap> & RouteStoryProps<TMap, TChronoLens, TFile, TImageData>>;

    private layerStylingToolIconId = 'layer-styling';
    private layerStylingToolPopupId = 'layer-styling';
    public abstract layerStylingComponent: ComponentType<ToolPopupProps<TMap> & RouteStoryLayerStylingPopupProps<TMap> & RouteStoryProps<TMap, TChronoLens, TFile, TImageData>>;

    private playerToolId = 'player';
    public abstract playerComponent: ComponentType<ToolPanelProps<TMap> & RouteStoryProps<TMap, TChronoLens, TFile, TImageData>>;

    private animatrixToolId = 'animatrix';
    public abstract animatrixHeaderComponent: ComponentType<ToolPanelProps<TMap> & RouteStoryProps<TMap, TChronoLens, TFile, TImageData>>;
    public abstract animatrixContentComponent: ComponentType<ToolPanelProps<TMap> & RouteStoryProps<TMap, TChronoLens, TFile, TImageData>>;

    private routeOverlayId = 'route';
    public abstract routeLayerComponent: ComponentType<OverlayComponentProps<TMap> & RouteStoryProps<TMap, TChronoLens, TFile, TImageData>>;

    private imagesOverlayId = 'images';
    public abstract imagesLayerComponent: ComponentType<OverlayComponentProps<TMap> & RouteStoryProps<TMap, TChronoLens, TFile, TImageData>>;

    /**
     * Wrapper to avoid binding issues in react native if components are wrapped in arg list.
     */
    public wrapProps<TProps extends {}, TToolProps extends {}>(
        Component: ComponentType<TToolProps & TProps>,
        props: TProps
    ): FC<TToolProps> {
        return (toolProps: TToolProps) => (
            <Component {...props} {...toolProps} />
        );
    }

    public getProps = (): RouteStoryProps<TMap, TChronoLens, TFile, TImageData> => ({
        gearId: this.id,
        translationKey: this.internalTranslationKey,
        animatrix: this.animatrix,
        data$: this.data$,
        splineData$: this.splineData$,
        state$: this.state$,
        routeTimes$: this.routeTimes$,
        images$: this.images$,
        progressMs$: this.progressMs$,
        fileOperator: this.fileOperator,
        playerOperator: this.playerOperator,
        fitBoundsHandler: this.fitBoundsHandler,
    });

    public engage = () => {
        this.animatrix.initialize(this.apparatus.storageKeeper, this.apparatus.translatron);
        this.apparatus.storageKeeper.synchronizeSubjectWithStorage(this.state$, 'route-story:state', cleanUpRouteStoryState)
            .then((subscription) => {
                this.stateStorageSubscription = subscription;
            });
        this.presetSubscription = this.subscribePreset();
        this.presetActiveSubscription = this.subscribePresetActive();
        this.engageRouteStory?.();
        setTimeout(() => {
            if (this.apparatus.cartomancer.map) {
                this.fitBoundsHandler(this.apparatus.cartomancer.map, this.data$.value.boundingBox);
            }
        }, 1000);
        this.dataSubscription = this.subscribeToDataUpdates();

        const layerStylingIcon = this.apparatus.toolsStation.addToolIcon(
            this.layerStylingToolIconId,
            {
                placement: 'left',
                icon: Icons.NounProject.Paint as unknown as string,
                tooltip: { n: this.id, t: this.internalTranslationKey.OpenLayerAestheticOptions },
                onClick: (_map) => {
                    const onClose = () => {
                        layerStylingIcon.active$.next(false);
                        this.apparatus.toolsStation.removeToolPopup(this.layerStylingToolPopupId);
                    };

                    if (!layerStylingIcon.active$.value) {
                        layerStylingIcon.active$.next(true);
                        
                        this.apparatus.toolsStation.addToolPopup(
                            this.layerStylingToolPopupId,
                            {
                                title: { n: this.id, t: this.internalTranslationKey.LayerAestheticOptions },
                                onClose,
                                contentComponent: this.wrapProps<RouteStoryLayerStylingPopupProps<TMap> & RouteStoryProps<TMap, TChronoLens, TFile, TImageData>, ToolPopupProps<TMap>>(this.layerStylingComponent, {
                                    ...this.getProps(),
                                    icon: layerStylingIcon,
                                })
                            }
                        );
                    } else {
                        onClose();
                    }
                },
            }
        );

        this.apparatus.toolsStation.addTopTool(
            this.routeNameToolId,
            this.wrapProps<RouteStoryProps<TMap, TChronoLens, TFile, TImageData>, TopToolsProps<TMap>>(this.routeUploadComponent, this.getProps())
        );

        this.apparatus.toolsStation.addToolPanel(
            this.playerToolId,
            {
                title: { n: this.id, t: this.internalTranslationKey.Player },
                placement: 'bottom',
                icon: Icons.NounProject.PlayerConfiguration as unknown as string,
                contentComponent: this.wrapProps<RouteStoryProps<TMap, TChronoLens, TFile, TImageData>, ToolPanelProps<TMap>>(this.playerComponent, this.getProps())
            }
        );

        this.apparatus.toolsStation.activeBottomPanelToolId$.next(this.playerToolId);

        this.apparatus.toolsStation.addToolPanel(
            this.animatrixToolId,
            {
                title: { n: this.animatrix.namespace, t: this.animatrix.translationKey.AnimatrixControls },
                placement: 'left',
                icon: Icons.NounProject.Animation as unknown as string,
                headerComponent: this.wrapProps<RouteStoryProps<TMap, TChronoLens, TFile, TImageData>, ToolPanelProps<TMap>>(this.animatrixHeaderComponent, this.getProps()),
                contentComponent: this.wrapProps<RouteStoryProps<TMap, TChronoLens, TFile, TImageData>, ToolPanelProps<TMap>>(this.animatrixContentComponent, this.getProps())
            }
        );

        this.apparatus.cartomancer.addOverlay(
            this.routeOverlayId,
            this.wrapProps<RouteStoryProps<TMap, TChronoLens, TFile, TImageData>, OverlayComponentProps<TMap>>(this.routeLayerComponent, this.getProps())
        );
        this.apparatus.cartomancer.addOverlay(
            this.imagesOverlayId,
            this.wrapProps<RouteStoryProps<TMap, TChronoLens, TFile, TImageData>, OverlayComponentProps<TMap>>(this.imagesLayerComponent, this.getProps())
        );
    };

    public disengage = () => {
        this.apparatus.cartomancer.removeOverlay(this.imagesOverlayId);
        this.apparatus.cartomancer.removeOverlay(this.routeOverlayId);
        this.apparatus.toolsStation.removeToolPanel(this.animatrixToolId);
        this.apparatus.toolsStation.removeToolPanel(this.playerToolId);
        this.apparatus.toolsStation.removeTopTool(this.routeNameToolId);
        this.apparatus.toolsStation.removeToolIcon(this.layerStylingToolIconId);
        this.apparatus.toolsStation.removeToolPopup(this.layerStylingToolPopupId);
        this.dataSubscription?.unsubscribe();
        this.stateStorageSubscription?.unsubscribe();
        this.disengageRouteStory?.();
        this.presetActiveSubscription?.unsubscribe();
        this.presetSubscription?.unsubscribe();
        this.animatrix.cleanUp();
    };

    public fitBoundsHandler = (map: TMap, boundingBox?: GeoJSON.BBox) => {
        if (!boundingBox) {
            return;
        }

        const notificationId = 'route-fit-bounds';
        this.apparatus.signaliumBureau.removeNotice(notificationId);

        try {
            const sw: [number, number] = [boundingBox[0], boundingBox[1]];
            const ne: [number, number] = [boundingBox[2], boundingBox[3]];

            this.fitBounds(map, sw, ne);
        } catch (err) {
            this.apparatus.signaliumBureau.addNotice({
                type: 'error',
                id: notificationId,
                text: (err as Error).message ?? 'Could not fit bounds to route',
                error: err as Error,
            });
        }
    };

    public fileOperator = new FileOperator(this);
    private playerOperator = new PlayerOperator(this);

    /**
     * Whether current control state matches the value of `preset$`.
     */
    public isPresetActive$ = new BehaviorSubject<boolean>(true);

    private subscribePreset = (): Subscription => {
        return this.preset$.subscribe((next) => {
            const option = RouteStoryGear.presetOptions.find((option) => option.value === next);
            if (!option) {
                return;
            }
            const { mapLayout: { size, ...mapLayout }, gaugeControls: { ...gaugeControls } } = option;
            this.apparatus.cartomancer.mapLayout$.next({ size: { ...size }, ...mapLayout });
            this.apparatus.cartomancer.gaugeControls$.next({ ...gaugeControls });
        });
    };

    private subscribePresetActive = (): Subscription => {
        return combineLatest([
            this.apparatus.cartomancer.mapLayout$,
            this.apparatus.cartomancer.gaugeControls$,
        ]).subscribe((args) => {
            this.isPresetActive$.next(RouteStoryGear.detectPreset(...args) === this.preset$.value);
        })
    };

    public static presetOptions: PresetOption[] = [
        {
            value: 'default',
            label: 'Default',
            mapLayout: Cartomancer.defaultMapLayout,
            gaugeControls: Cartomancer.defaultGaugeControls,
        },
        {
            value: 'racing-game',
            label: 'Racing game',
            mapLayout: {
                size: {
                    type: 'manual',
                    width: 400,
                    height: 400
                },
                borderWidth: 5,
                borderColor: '#ff0000',
                borderRadius: '50%',
                innerBorderWidth: 0,
                innerBorderColor: '#000000',
                boxShadow: '0px 0px 16px #ff0000, 0px 0px 16px #ff0000',
                innerBoxShadow: '',
            },
            gaugeControls: Cartomancer.defaultGaugeControls,
        },
    ];

    public static detectPreset = (
        { size, ...mapLayout }: MapLayout,
        { ...gaugeControls }: GaugeControlsType,
    ): Preset | undefined => {
        return this.presetOptions.find((option) => (
            Object.entries(size).every(([key, value]) => option.mapLayout.size[key as keyof MapLayout['size']] === value) &&
            Object.entries(mapLayout).every(([key, value]) => option.mapLayout[key as keyof MapLayout] === value) &&
            Object.entries(gaugeControls).every(([key, value]) => option.gaugeControls[key as keyof GaugeControlsType] === value)
        ))?.value;
    };

    /**
     * @returns A copy of preset values, if found for a given `preset`.
     */
    public getPresetValues = (preset: Preset): {
        mapLayout: MapLayout;
        gaugeControls: GaugeControlsType;
    } | undefined => {
        const option = RouteStoryGear.presetOptions.find((option) => option.value === preset);

        if (option) {
            return {
                mapLayout: this.copyMapLayout(option.mapLayout),
                gaugeControls: this.copyGaugeControls(option.gaugeControls),
            };
        }
    };

    /**
     * Returns a new deep copy of gauge controls
     */
    public copyMapLayout = (mapLayout: MapLayout): MapLayout => {
        const { size, ...layout } = mapLayout;

        return {
            ...layout,
            size: { ...size }
        };
    };

    /**
     * Returns a new deep copy of gauge controls
     */
    public copyGaugeControls = (gaugeControls: GaugeControlsType): GaugeControlsType => {
        return { ...gaugeControls };
    };

    /**
     * Returns a new deep copy of animation controls
     */
    public copyAnimationControls = (animationControls: AnimationControlsType): AnimationControlsType => {
        return { ...animationControls };
    };
};
