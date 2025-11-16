import { Theme } from "../theme";
import { AnimationControlsType, ApplicationSettingsType, CameraAngle, ControlPlacement, GaugeControlsType, MapLayout, Preset, PresetOption } from "./model";

export const controlsPositions: maplibregl.ControlPosition[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
];

export const defaultGaugeControls: GaugeControlsType = {
    globeProjection: true,
    showZoomButtons: false,
    showCurrentZoom: true,
    showCompass: true,
    showGreenScreen: false,
    controlPosition: 'top-right',
    controlPlacement: { top: 0, bottom: 0, left: 0, right: 0 },
    showRouteLine: true,
    showRoutePoints: true,
}

export const defaultApplicationSettings: ApplicationSettingsType = {
    theme: Theme.Dark,
    /**
     * When set to true, user will be shown a confirmation popup on page close or reload.
     */
    confirmBeforeLeave: false,
}

export const defaultMapLayout: MapLayout = {
    size: {
        type: 'full-screen',
        width: 400,
        height: 400
    },
    borderWidth: 0,
    borderColor: '#000',
    borderRadius: '0',
    innerBorderWidth: 0,
    innerBorderColor: '#000000',
    boxShadow: '',
    innerBoxShadow: '',
};

export const racingGameMapLayout: MapLayout = {
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
};

export const defaultZoomInToImages = 15;

export const defaultAnimationControls: AnimationControlsType = {
    cameraAngle: 0,
    followCurrentPoint: true,
    autoRotate: true,
    pitch: 0,
    zoom: 10,
    zoomInToImages: defaultZoomInToImages,
    cameraRoll: 0,
    speedMultiplier: 10000,
    easeDuration: 100,
};

export const presetOptions: PresetOption[] = [
    {
        value: 'default',
        label: 'Default',
        mapLayout: defaultMapLayout,
        gaugeControls: defaultGaugeControls,
        animationControls: defaultAnimationControls,
    },
    {
        value: 'racing-game',
        label: 'Racing game',
        mapLayout: racingGameMapLayout,
        gaugeControls: defaultGaugeControls,
        animationControls: defaultAnimationControls,
    },
];

export const detectPreset = (
    mapLayout: MapLayout,
    { controlPlacement, ...gaugeControls }: GaugeControlsType,
): Preset => {
    return presetOptions.find((option) => (
        Object.entries(mapLayout).every(([key, value]) => option.mapLayout[key as keyof MapLayout] === value) &&
        Object.entries(gaugeControls).every(([key, value]) => option.gaugeControls[key as keyof GaugeControlsType] === value) &&
        Object.entries(controlPlacement).every(([key, value]) => option.gaugeControls.controlPlacement[key as keyof ControlPlacement] === value)
    ))?.value ?? "";
};

export const clamp = (value: number, range: [number, number]) => {
    const [min, max] = range;

    return Math.max(min, Math.min(max, value));
}

export const pitchRange: [number, number] = [0, 85];
export const zoomRange: [number, number] = [0, 20];
export const cameraAngleRange: [number, number] = [-360, 360]
export const cameraRollRange: [number, number] = [-360, 360]
export const speedMultiplierRange: [number, number] = [0, 1000000]
export const easeDurationRange: [number, number] = [0, 1000]