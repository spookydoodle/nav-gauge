import { BehaviorSubject } from "rxjs";
import { AnimationControlsType } from "../controls";
import { cleanUpAnimationControls } from "../validation";

/**
 * Animation central processing unit.
 */
export class Animatrix {
    public controls$: BehaviorSubject<AnimationControlsType>;

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

    private localStorageId = 'animatrix:controls';

    public constructor() {
        let initialState = Animatrix.defaultControls;
        let savedData = localStorage.getItem(this.localStorageId);
        if (savedData) {
            initialState = Object.assign(initialState, cleanUpAnimationControls(JSON.parse(savedData) as AnimationControlsType));
        }
        this.controls$ = new BehaviorSubject(initialState);

        this.controls$.subscribe((controls) => localStorage.setItem(this.localStorageId, JSON.stringify(controls)))
    }

    /**
     * Which image should be in display now.
     */
    public displayImageId$ = new BehaviorSubject<number | null>(null);
}