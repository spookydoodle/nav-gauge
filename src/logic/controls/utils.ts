import { ApplicationSettingsType, ControlPlacement, GaugeControlsType, MapLayout, Preset, PresetOption } from "./model";

export const controlsPositions: maplibregl.ControlPosition[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
];

export const defaultGaugeControls: GaugeControlsType = {
    globeProjection: true,
    showZoom: false,
    showCompass: true,
    showGreenScreen: false,
    controlPosition: 'top-right',
    controlPlacement: { top: 0, bottom: 0, left: 0, right: 0 },
    showRouteLine: true,
    showRoutePoints: true,
}

export const defaultApplicationSettings: ApplicationSettingsType = {
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

export const presetOptions: PresetOption[] = [
    {
        value: 'default',
        label: 'Default',
        mapLayout: defaultMapLayout,
        gaugeControls: defaultGaugeControls,
    },
    {
        value: 'racing-game',
        label: 'Racing game',
        mapLayout: racingGameMapLayout,
        gaugeControls: defaultGaugeControls,
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