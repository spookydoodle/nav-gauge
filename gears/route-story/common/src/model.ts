import { BehaviorSubject } from "rxjs";
import { ChronoLens, GaugeControlsType, MapLayout, MarkerImage, ToolIcon } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import { FileOperator } from "./file-operator";
import { PlayerOperator } from "./player-operator";
import { Animatrix } from "./animatrix";
import { SplineData } from "./tinkers";
import { Icons } from "@ui";

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
    color: string;
    width: number;
    outlineColor: string;
    outlineWidth: number;
    variant: 'solid' | 'dashed';
}

export interface CurrentPointStyle {
    fillColor: string;
    outlineColor: string;
    /**
     * Radius in pixels.
     */
    size: number;
    shape: CurrentPointStyleShape | CurrentPointStyleIcon;
}

export interface CurrentPointStyleShape {
    type: 'simple';
    shape: 'circle' | 'triangle';
}

export interface CurrentPointStyleIcon {
    type: 'icon';
    icon: typeof Icons.NounProject.AlienGun;
    /**
     * When `true` will rotate according to the current point heading.
     */
    rotate: boolean;
}

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
    Shape = 'shape',
    Circle = 'circle',
    Triangle = 'triangle',
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
