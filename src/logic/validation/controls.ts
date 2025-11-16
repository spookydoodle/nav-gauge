import { AnimationControlsType, cameraAngles, GaugeControlsType, MapLayout } from "../controls";

const validateString = (value: unknown, name: string) => {
    if (value !== undefined && typeof value !== 'string') {
        throw new Error(`${name} should be of type string.`);
    }
};

const validateNumber = (value: unknown, name: string) => {
    if (value !== undefined && typeof value !== 'number') {
        throw new Error(`${name} should be a number.`);
    }
};

const validateStringEnum = (value: unknown, name: string, allowedValues: string[]) => {
    if (value !== undefined && !allowedValues.includes(value as string)) {
        throw new Error(`${name} should be one of: ${allowedValues.join(', ')}.`);
    }
};

const validateBoolean = (value: unknown, name: string) => {
    if (value !== undefined && typeof value !== 'boolean') {
        throw new Error(`${name} should be of type boolean.`);
    }
};

export const validateMapLayout = (mapLayout: Partial<MapLayout>) => {
    validateString(mapLayout.borderColor, 'Border color');
    validateString(mapLayout.borderRadius, 'Border radius');
    validateString(mapLayout.borderWidth, 'Border width');
    validateString(mapLayout.boxShadow, 'Box shadow');
    validateStringEnum(mapLayout.size?.type, 'Size type', ['full-screen', 'manual']);
    validateNumber(mapLayout.size?.height, 'Height');
    validateNumber(mapLayout.size?.width, 'Width');
    validateString(mapLayout.innerBorderColor, 'Inner border color');
    validateNumber(mapLayout.innerBorderWidth, 'Inner border width');
};

export const validateGaugeControls = (gaugeControls: Partial<GaugeControlsType>) => {
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
    validateBoolean(animationControls.autoRotate, "Auto rotate");
    validateStringEnum(animationControls.cameraAngle, 'Camera angle', cameraAngles);
    validateBoolean(animationControls.followCurrentPoint, 'Follow current point');
    validateNumber(animationControls.pitch, 'Pitch');
    validateNumber(animationControls.zoom, 'Zoom');
    if (animationControls.zoomInToImages !== undefined && animationControls.zoomInToImages !== false && typeof animationControls.zoomInToImages !== 'number') {
        throw new Error('Zoom in to images should be either false or of type number.');
    }
};
