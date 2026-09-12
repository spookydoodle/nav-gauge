import { BehaviorSubject } from "rxjs";
import { ChronoLens, GaugeControlsType, MapLayout, MarkerImage, ToolIcon } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import { Icons } from "@ui";
import { FileOperator } from "./file-operator";
import { PlayerOperator } from "./player-operator";
import { Animatrix } from "./animatrix";
import { SplineData } from "./tinkers";

export interface RouteTimes {
    startTime: string;
    endTime: string;
    startTimeEpoch: number;
    endTimeEpoch: number;
    duration: number;
}

export interface RouteStoryState {
    /**
     * Applied to the route line part after current point.
     */
    routeStyleInactive: RouteStoryLineStyle;
    /**
     * Applied to the route line part before current point.
     */
    routeStyleActive: RouteStoryLineStyle;
    currentPoint: CurrentPointStyle;
}

export interface RouteStoryLineStyle {
    showRouteLine: boolean;
    showRoutePoints: boolean;
    pointColor: string;
    pointRadius: number;
    color: string;
    width: number;
    outlineColor: string;
    outlineWidth: number;
    variant: 'solid' | 'dashed';
}

export interface CurrentPointStyle {
    fillColor: string;
    size: number;
    icon: CurrentPointIconName;
    autoRotate: boolean;
    rotation: number;
    rotationAlignment: 'map' | 'viewport';
}

export const currentPointIconNames = [
    'Circle',
    'AeroplaneSide01',
    'AeroplaneSide02',
    'AeroplaneTop01',
    'BikeFront01',
    'BikeSide01',
    'BikeSide02',
    'BikerSide01',
    'CarFront01',
    'CarSide01',
    'CarSide02',
    'CarSide03',
    'CarTop01',
    'EBikeSide01',
    'MotorcycleSide01',
    'Rocket01',
    'RunCameleon01',
    'RunSide01',
    'RunSide02',
    'RunWomanSide01',
    'ScooterFront01',
    'TrainFront01',
    'TrainSide01',
    'TrainSide02',
    'VanSide01',
    'VanSide02',
    'Walk01',
    'WalkDog01',
    'WalkFamily01',
    'WalkFamily02',
    'WalkMobile01',
    'WalkShoes01',
    'ZeppelinSide01',
    'ZeppelinSide02',
] as const satisfies readonly (Exclude<keyof typeof Icons, 'NounProject'> | keyof typeof Icons.NounProject)[];

export type CurrentPointIconName = typeof currentPointIconNames[number];

export interface RouteStoryLayerStylingPopupProps<TMap> {
    icon: ToolIcon<TMap>;
}

export interface RouteStoryProps<TMap, TChronoLens extends ChronoLens, TFile extends RouteStoryFile, TImageData> {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    animatrix: Animatrix;
    data$: BehaviorSubject<ParsingResultWithError>;
    splineData$: BehaviorSubject<SplineData | null>;
    state$: BehaviorSubject<RouteStoryState>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<TImageData>[]>;
    progressMs$: BehaviorSubject<number>;
    fileOperator: FileOperator<TMap, TChronoLens, TFile, TImageData>;
    playerOperator: PlayerOperator<TMap, TChronoLens, TFile, TImageData>;
    fitBoundsHandler: (map: TMap, boundingBox?: GeoJSON.BBox) => void;
}

export interface RouteFitBoundsProps<TMap> {
    data$: BehaviorSubject<ParsingResultWithError>;
    onFitBounds: (map: TMap, sw: [number, number], ne: [number, number]) => void;
}

export interface RouteStoryFile {
    name?: string | null;
    type: string | null;
}

export enum RouteStoryTranslationKey {
    FitBounds = 'fit-bounds',
    Player = 'player',
    NoName = 'no-name',
    UploadFile = 'upload-file',
    ReplaceFile = 'replace-file',
    PurgeStory = 'purge-story',
    Cancel = 'cancel',
    DestroyRecording = 'destroy-recording',
    StartRecording = 'start-recording',
    StopRecording = 'stop-recording',
    PauseRecording = 'pause-recording',
    ResumeRecording = 'resume-recording',
    LayerAestheticOptions = 'layer-aesthetic-options',
    OpenLayerAestheticOptions = 'open-layer-aesthetic-options',
    Lines = 'lines',
    Points = 'points',
    Line = 'line',
    Outline = 'outline',
    LineStyle = 'line-style',
    CurrentPoint = 'current-point',
    Active = 'active',
    Inactive = 'inactive',
    Color = 'color',
    Width = 'width',
    OutlineColor = 'outline-color',
    OutlineWidth = 'outline-width',
    Variant = 'variant',
    Solid = 'solid',
    Dashed = 'dashed',
    Size = 'size',
    Icon = 'icon',
    AutoRotate = 'auto-rotate',
    Rotation = 'rotation',
    RotationAlignment = 'rotation-alignment',
    Map = 'map',
    Viewport = 'viewport',
    Circle = 'circle',
    Opacity = 'opacity',
    RestoreDefaults = 'restore-defaults',
    Close = 'close',
    Slider = 'slider',
    Play = 'play',
    Pause = 'pause',
    Image = 'image',
    ShowImageMarkers = 'show-image-markers',
    HideImageMarkers = 'hide-image-markers',
    PurgeStoryText = 'purge-story-text',
}

export type Preset = 'default' | 'racing-game';

export interface PresetOption {
    value: Preset;
    label: string;
    mapLayout: MapLayout;
    gaugeControls: GaugeControlsType;
}
