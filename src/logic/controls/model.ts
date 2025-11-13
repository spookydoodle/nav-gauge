export interface MapLayout {
    size: MapLayoutSize;
    borderWidth: number;
    borderColor: string;
    innerBorderWidth: number;
    innerBorderColor: string;
    borderRadius: string;
    boxShadow: string;
    innerBoxShadow: string;
};

export interface MapLayoutSize {
    type: 'manual' | 'full-screen',
    width: number;
    height: number;
}

export interface ControlPlacement {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface GaugeControlsType {
    globeProjection: boolean;
    showZoom: boolean;
    showCompass: boolean;
    showGreenScreen: boolean;
    controlPosition: maplibregl.ControlPosition;
    controlPlacement: ControlPlacement;
    showRouteLine: boolean;
    showRoutePoints: boolean;
}

export interface ApplicationSettingsType {
    confirmBeforeLeave: boolean;
}

export type Preset = 'default' | 'racing-game' | 'test1' | '';

export interface PresetOption {
    value: Preset;
    label: string;
    mapLayout: MapLayout;
    gaugeControls: GaugeControlsType;
}
