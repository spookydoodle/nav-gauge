import { Theme } from "../theme";

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
    controlPosition: maplibregl.ControlPosition;
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

export interface AnimationControlsType {
    /**
     * Whether the camera should move to keep current point in the center of the map.
     * When set to `true`, `zoom` will be applied according to the user setting.
     * When set to `false`, zoom will be chosen automatically to fit the whole route on the map.
     */
    followCurrentPoint: boolean;
    /**
     * From which side should the camera look at current point on the route. Map beaering.
     * If `followCurrentPoint` is enabled, will be offset by the current point bearing.
     */
    cameraAngle: number;
    /**
     * Camera roll in degrees
     */
    cameraRoll: number;
    /**
     * If set to `true`, will apply rotation according to the direction where current point is heading to.
     */
    autoRotate: boolean;
    /**
     * Pitch to keep during recording. Value between 0 and 85.
     */
    pitch: number;
    /**
     * Only applicable if `followCurrentPoint` is set to `true`.
     */
    zoom: number;
    /**
     * If set to a number, will apply it to the map zoom when route animation pauses to show the images.
     */
    zoomInToImages: false | number;
    /**
     * Value in seconds by which to move current point on the route (relates to timestamp).
     */
    speedMultiplier: number;
    /**
     * Easing duration in milliseconds given to animation function.
     */
    easeDuration: number;
}

export interface ApplicationSettingsType {
    theme: Theme;
    /**
     * When set to `true`, a native browser confirmation popup will be shown before closing or reloading the page.
     */
    confirmBeforeLeave: boolean;
}

export type Preset = 'default' | 'racing-game' | '';

export interface PresetOption {
    value: Preset;
    label: string;
    mapLayout: MapLayout;
    gaugeControls: GaugeControlsType;
    animationControls: AnimationControlsType;
}

export interface PresetValues {
    presetMapLayout?: MapLayout;
    presetGaugeControls?: GaugeControlsType;
    presetAnimationControls?: AnimationControlsType;
}
