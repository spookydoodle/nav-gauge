export interface AnimationControlsType {
    /**
     * How long to view the image for (in milliseconds).
     * Defaults to `3000` (3 seconds).
     */
    displayImageDuration: number;
    /**
     * How long it takes for the current point to travel from the start to the end of the route (in milliseconds).
     * Does not include the time the camera pauses on displayed images; `total recording duration` = this + number of displayed images * `displayImageDuration`.
     */
    routePlaybackDuration: number;

    /**
     * Whether the camera should move to keep current point in the center of the map.
     * When set to `true`, `zoom` will be applied according to the user setting.
     * When set to `false`, zoom will be chosen automatically to fit the whole route on the map.
     */
    followCurrentPoint: boolean;
    /**
     * Only applicable if `followCurrentPoint` is set to `true`.
     */
    cameraZoom: number;
    /**
     * Camera angle (map bearing) From which side should the camera look at current point on the route. Map beaering.
     * If `autoRotate` is enabled, will be offset by the current point bearing.
     */
    cameraAngle: number;
    /**
     * Camera tilt (map pitch) to keep during recording. Value between 0 and 85.
     */
    cameraTilt: number;
    /**
     * Camera roll (map rotate) in degrees
     */
    cameraRoll: number;
    /**
     * Easing duration in milliseconds given to animation function.
     */
    easeDuration: number;

    /**
     * If set to `true`, will apply rotation according to the direction where current point is heading to.
     */
    autoRotate: boolean;

    /**
     * If set to `true`, when the route animation runs to the end it will pan the camera to fit the
     * whole route bounding box (and mark the route end on the player timeline).
     */
    panToWholeRouteAtEnd: boolean;
}

export enum AnimatrixTranslationKey {
    AnimatrixControls = 'animatrix-controls',
    General = 'general',
    FollowCurrentPoint = 'follow-current-point',
    AutoRotate = 'auto-rotate',
    CameraAngle = 'camera-angle',
    CameraRoll = 'camera-roll',
    Pitch = 'pitch',
    Zoom = 'zoom',
    ImagePauseDuration = 'image-pause-duration',
    RoutePlaybackDuration = 'route-playback-duration',
    TotalRecordingDuration = 'total-recording-duration',
    EaseDuration = 'ease-duration',
    PanToWholeRouteAtEnd = 'pan-to-whole-route-at-end',
    Search = 'search',
}
