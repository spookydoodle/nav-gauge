import { BehaviorSubject } from "rxjs";
import { validateBoolean, validateNumber } from "../../../../tinker-chest/src";
import { AnimationControlsType } from "./model";

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
    public static pitchRange: [number, number] = [0, 85];
    public static zoomRange: [number, number] = [0, 20];
    public static bearingLineLengthInMetersRange: [number, number] = [0, 100000];
    public static maxBearingDiffPerFrameRange: [number, number] = [0, 360];
    public static cameraAngleRange: [number, number] = [-360, 360];
    public static cameraRollRange: [number, number] = [-360, 360];
    public static speedMultiplierRange: [number, number] = [0, 1000000];
    public static easeDurationRange: [number, number] = [0, 1000];

    private localStorageId = 'animatrix:controls';

    public constructor() {
        let initialState = Animatrix.defaultControls;
        let savedData = localStorage.getItem(this.localStorageId);
        if (savedData) {
            initialState = Object.assign(initialState, this.cleanUpAnimationControls(JSON.parse(savedData) as AnimationControlsType));
        }
        this.controls$ = new BehaviorSubject(initialState);

        this.controls$.subscribe((controls) => localStorage.setItem(this.localStorageId, JSON.stringify(controls)))
    }

    /**
     * Which image should be in display now.
     */
    public displayImageId$ = new BehaviorSubject<number | null>(null);

    private cleanUpAnimationControls = (state: unknown): Partial<AnimationControlsType> => {
        const { cameraAngle, ...controls } = state as AnimationControlsType;
        return {
            cameraAngle: typeof cameraAngle === 'number' ? cameraAngle : Animatrix.defaultControls.cameraAngle,
            ...controls
        };
    };

    public static validateAnimationControls = (animationControls: Partial<AnimationControlsType>) => {
        validateBoolean(animationControls.followCurrentPoint, 'Follow current point');
        validateBoolean(animationControls.autoRotate, "Auto rotate");
        validateNumber(animationControls.bearingLineLengthInMeters, "Bearing line length in meters", Animatrix.bearingLineLengthInMetersRange);
        validateNumber(animationControls.maxBearingDiffPerFrame, "Max bearing diff per frame", Animatrix.maxBearingDiffPerFrameRange);
        validateNumber(animationControls.cameraAngle, 'Camera angle', Animatrix.cameraAngleRange);
        validateNumber(animationControls.cameraRoll, 'Camera roll', Animatrix.cameraRollRange);
        validateNumber(animationControls.pitch, 'Pitch', Animatrix.pitchRange);
        validateNumber(animationControls.zoom, 'Zoom', Animatrix.zoomRange);
        if (animationControls.zoomInToImages !== undefined && animationControls.zoomInToImages !== false && typeof animationControls.zoomInToImages !== 'number') {
            throw new Error(`Zoom in to images should be either false or of type number within range [${Animatrix.zoomRange.join(', ')}]`);
        }
        if (animationControls.zoomInToImages && typeof animationControls.zoomInToImages === 'number') {
            validateNumber(animationControls.zoomInToImages, 'Zoom in to images', Animatrix.zoomRange);
        }
        validateNumber(animationControls.displayImageDuration, 'Image pause duration', Animatrix.displayImageDurationRange);
        validateNumber(animationControls.speedMultiplier, 'Speed in seconds per frame', Animatrix.speedMultiplierRange);
        validateNumber(animationControls.easeDuration, 'Ease duration', Animatrix.easeDurationRange);
    }
}