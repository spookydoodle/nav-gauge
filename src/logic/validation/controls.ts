import { AnimationControlsType, easeDurationRange, GaugeControlsType, MapLayout, pitchRange, cameraRollRange, speedMultiplierRange, zoomRange, cameraAngleRange, bearingLineLengthInMetersRange, maxBearingDiffPerFrameRange } from "../controls";
import { Animatrix } from "../state/animatrix";

const validateString = (value: unknown, name: string) => {
    if (value !== undefined && typeof value !== 'string') {
        throw new Error(`${name} should be of type string`);
    }
};

const validateNumber = (value: unknown, name: string, range?: [number, number]) => {
    if (value !== undefined && typeof value !== 'number') {
        throw new Error(`${name} should be of type number`);
    }
    if (range && value !== undefined && (value < range[0] || value > range[1])) {
        throw new Error(`${name} should be within range [${range.join(', ')}]`);
    }
};

const validateStringEnum = (value: unknown, name: string, allowedValues: string[]) => {
    if (value !== undefined && !allowedValues.includes(value as string)) {
        throw new Error(`${name} should be one of: ${allowedValues.join(', ')}`);
    }
};

const validateBoolean = (value: unknown, name: string) => {
    if (value !== undefined && typeof value !== 'boolean') {
        throw new Error(`${name} should be of type boolean`);
    }
};

export const validateMapLayout = (mapLayout: Partial<MapLayout>) => {
    validateString(mapLayout.borderColor, 'Border color');
    validateString(mapLayout.borderRadius, 'Border radius');
    validateNumber(mapLayout.borderWidth, 'Border width');
    validateString(mapLayout.boxShadow, 'Box shadow');
    validateStringEnum(mapLayout.size?.type, 'Size type', ['full-screen', 'manual']);
    validateNumber(mapLayout.size?.height, 'Height');
    validateNumber(mapLayout.size?.width, 'Width');
    validateString(mapLayout.innerBorderColor, 'Inner border color');
    validateNumber(mapLayout.innerBorderWidth, 'Inner border width');
    validateString(mapLayout.innerBoxShadow, 'Inner box shadow');
};

export const validateGaugeControls = (gaugeControls: Partial<GaugeControlsType>) => {
    if (gaugeControls.controlPlacement && typeof gaugeControls.controlPlacement !== 'object') {
        throw new Error('Control placement incorrect');
    }
    if (gaugeControls.controlPlacement && !(
        'left' in gaugeControls.controlPlacement ||
        'top' in gaugeControls.controlPlacement ||
        'right' in gaugeControls.controlPlacement ||
        'bottom' in gaugeControls.controlPlacement
    )) {
        throw new Error('Control placement missing required keys: top, left, right, bottom');
    }
    validateNumber(gaugeControls.controlPlacement?.left, 'Control placement left');
    validateNumber(gaugeControls.controlPlacement?.top, 'Control placement top');
    validateNumber(gaugeControls.controlPlacement?.right, 'Control placement right');
    validateNumber(gaugeControls.controlPlacement?.bottom, 'Control placement bottom');
    validateStringEnum(gaugeControls.controlPosition, 'Control position', ["top-left", "top-right", "bottom-left", "bottom-right"]);
    validateBoolean(gaugeControls.globeProjection, 'Globe projection');
    validateBoolean(gaugeControls.showCompass, 'Show compass');
    validateBoolean(gaugeControls.showZoomButtons, 'Show zoom buttons');
    validateBoolean(gaugeControls.showCurrentZoom, 'Show current zoom');
    validateBoolean(gaugeControls.showGreenScreen, 'Show green screen');
    validateBoolean(gaugeControls.showRouteLine, 'Show route line');
    validateBoolean(gaugeControls.showRoutePoints, 'Show route points');
};

export const validateAnimationControls = (animationControls: Partial<AnimationControlsType>) => {
    validateBoolean(animationControls.followCurrentPoint, 'Follow current point');
    validateBoolean(animationControls.autoRotate, "Auto rotate");
    validateNumber(animationControls.bearingLineLengthInMeters, "Bearing line length in meters", bearingLineLengthInMetersRange);
    validateNumber(animationControls.maxBearingDiffPerFrame, "Max bearing diff per frame", maxBearingDiffPerFrameRange);
    validateNumber(animationControls.cameraAngle, 'Camera angle', cameraAngleRange);
    validateNumber(animationControls.cameraRoll, 'Camera roll', cameraRollRange);
    validateNumber(animationControls.pitch, 'Pitch', pitchRange);
    validateNumber(animationControls.zoom, 'Zoom', zoomRange);
    if (animationControls.zoomInToImages !== undefined && animationControls.zoomInToImages !== false && typeof animationControls.zoomInToImages !== 'number') {
        throw new Error(`Zoom in to images should be either false or of type number within range [${zoomRange.join(', ')}]`);
    }
    if (animationControls.zoomInToImages && typeof animationControls.zoomInToImages === 'number') {
        validateNumber(animationControls.zoomInToImages, 'Zoom in to images', zoomRange);
    }
    validateNumber(animationControls.displayImageDuration, 'Image pause duration', Animatrix.displayImageDurationRange);
    validateNumber(animationControls.speedMultiplier, 'Speed in seconds per frame', speedMultiplierRange);
    validateNumber(animationControls.easeDuration, 'Ease duration', easeDurationRange);
};

export const applyGaugeControls = (possibleGaugeControls: GaugeControlsType): GaugeControlsType => {
    return {
        ...possibleGaugeControls,
        controlPlacement: {
            left: possibleGaugeControls.controlPlacement.left,
            top: possibleGaugeControls.controlPlacement.top,
            right: possibleGaugeControls.controlPlacement.right,
            bottom: possibleGaugeControls.controlPlacement.bottom,
        }
    };
};

/**
 * TODO: Implement
 * @param state 
 * @returns 
 */
export const cleanUpAnimationControls = (state: unknown): Partial<AnimationControlsType> => {
    const { cameraAngle, ...controls } = state as AnimationControlsType;
    return {
        cameraAngle: typeof cameraAngle === 'number' ? cameraAngle : Animatrix.defaultControls.cameraAngle,
        ...controls
    };
};