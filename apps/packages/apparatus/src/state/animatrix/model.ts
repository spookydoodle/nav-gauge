export interface AnimationControlsType {
    /**
     * Whether the camera should move to keep current point in the center of the map.
     * When set to `true`, `zoom` will be applied according to the user setting.
     * When set to `false`, zoom will be chosen automatically to fit the whole route on the map.
     */
    followCurrentPoint: boolean;
    /**
     * If set to `true`, will apply rotation according to the direction where current point is heading to.
     */
    autoRotate: boolean;
    /**
     * From which side should the camera look at current point on the route. Map beaering.
     * If `autoRotate` is enabled, will be offset by the current point bearing.
     */
    cameraAngle: number;
    /**
     * Camera roll in degrees
     */
    cameraRoll: number;
    /**
     * Used to detect the first points before/after current point which are at least half of that value away from current point.
     * Bearing for current point used to auto rotate the map will be calculated using this line.
     */
    bearingLineLengthInMeters: number;
    /**
     * Maximum amount of degrees to allow updating the map bearing each frame (when `autoRotate` is enabled).
     */
    maxBearingDiffPerFrame: number;
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
     * How long to view the image for (in milliseconds).
     * Defaults to `3000` (3 seconds).
     */
    displayImageDuration: number;
    /**
     * Value in seconds by which to move current point on the route (relates to timestamp).
     */
    speedMultiplier: number;
    /**
     * Easing duration in milliseconds given to animation function.
     */
    easeDuration: number;
}
