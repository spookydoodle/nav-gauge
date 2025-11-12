export interface ControlPlacement {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

// TODO: Rename
export interface GaugeControlsType {
    globeProjection: boolean;
    showZoom: boolean;
    showCompass: boolean;
    showGreenScreen: boolean;
    controlPosition: maplibregl.ControlPosition;
    controlPlacement: ControlPlacement;
    showRouteLine: boolean;
    showRoutePoints: boolean;
    // TODO: Move to another settings section
    confirmBeforeLeave: boolean;
}
