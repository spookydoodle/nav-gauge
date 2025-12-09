import { BehaviorSubject } from "rxjs";
import { AnimationControlsType } from "../controls";

/**
 * Animation central processing unit.
 */
export class Animatrix {
    public static defaultControls: AnimationControlsType = {
        followCurrentPoint: true,
        autoRotate: true,
        bearingLineLengthInMeters: 500,
        maxBearingDiffPerFrame: 5,
        cameraAngle: 0,
        pitch: 0,
        zoom: 12,
        zoomInToImages: false,
        displayImageDuration: 3000,
        cameraRoll: 0,
        speedMultiplier: 5000,
        easeDuration: 100,
    };

    public static displayImageDurationRange: [number, number] = [0, 10000];

    public constructor() {

    }

    public controls$ = new BehaviorSubject<AnimationControlsType>(Animatrix.defaultControls);

    /**
     * Which image should be in display now.
     */
    public displayImageId$ = new BehaviorSubject<number | null>(null);
}