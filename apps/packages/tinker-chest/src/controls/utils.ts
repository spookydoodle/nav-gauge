import { Theme } from "@ui";
import { ApplicationSettingsType, GaugeControlsType, MapLayout } from "./model";

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

// TODO
export const defaultZoomInToImages = 15;



export const clamp = (value: number, range: [number, number]) => {
    const [min, max] = range;

    return Math.max(min, Math.min(max, value));
}

