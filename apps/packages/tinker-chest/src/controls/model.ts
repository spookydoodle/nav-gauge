import { Theme } from "@ui";

export type ControlPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

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
    showZoomButtons: boolean;
    showCurrentZoom: boolean;
    showCompass: boolean;
    showGreenScreen: boolean;
    controlPosition: ControlPosition;
    controlPlacement: ControlPlacement;
    showRouteLine: boolean;
    showRoutePoints: boolean;
}

export enum CameraAngle {
    Top = 'Top',
    Left = 'Left',
    Front = 'Front',
    Right = 'Right',
    Rear = 'Rear'
}

export interface ApplicationSettingsType {
    theme: Theme;
    /**
     * When set to `true`, a native browser confirmation popup will be shown before closing or reloading the page.
     */
    confirmBeforeLeave: boolean;
}
