import { MapLayout } from "../../nav-gauge/controls/MapLayoutControls";
import { GaugeControlsType } from "../controls";

export const validateMapLayout = (mapLayout: Partial<MapLayout>) => {
    if (mapLayout.borderColor && typeof mapLayout.borderColor !== 'string') {
        throw new Error('Border color should be of type string');
    }
    if (mapLayout.borderRadius && typeof mapLayout.borderRadius !== 'string') {
        throw new Error('Border radius should be of type string');
    }
    if (mapLayout.borderWidth && typeof mapLayout.borderWidth !== 'number') {
        throw new Error('Border width should be of type number');
    }
    if (mapLayout.boxShadow && typeof mapLayout.boxShadow !== 'string') {
        throw new Error('Box shadow should be of type string');
    }
    if (mapLayout.size?.type && !['full-screen', 'manual'].includes(mapLayout.size.type)) {
        throw new Error('Size type should be of type full-screen or manual');
    }
    if (mapLayout.size?.height && typeof mapLayout.size.height !== 'number') {
        throw new Error('Height should be of type number');
    }
    if (mapLayout.size?.width && typeof mapLayout.size.width !== 'number') {
        throw new Error('Width should be of type number');
    }
    if (mapLayout.innerBorderColor && typeof mapLayout.innerBorderColor !== 'string') {
        throw new Error('Inner border color should be of type string');
    }
    if (mapLayout.innerBorderWidth && typeof mapLayout.innerBorderWidth !== 'number') {
        throw new Error('Inner border width should be of type number');
    }
    if (mapLayout.innerBoxShadow && typeof mapLayout.innerBoxShadow !== 'string') {
        throw new Error('Inner box shadow should be of type string');
    }
};

export const validateGaugeControls = (gaugeControls: Partial<GaugeControlsType>) => {
    if (gaugeControls.controlPlacement && (
        typeof gaugeControls.controlPlacement.top !== 'number' ||
        typeof gaugeControls.controlPlacement.bottom !== 'number' ||
        typeof gaugeControls.controlPlacement.left !== 'number' ||
        typeof gaugeControls.controlPlacement.right !== 'number'
    )) {
        throw new Error("Control placement incorrect");
    }
    if (gaugeControls.controlPosition && !["top-left", "top-right", "bottom-left", "bottom-right"].includes(gaugeControls.controlPosition)) {
        throw new Error("Control position incorrect");
    }
    if (gaugeControls.globeProjection !== undefined && typeof gaugeControls.globeProjection !== 'boolean') {
        throw new Error("Globe projection incorrect");
    }
    if (gaugeControls.showCompass !== undefined && typeof gaugeControls.showCompass !== 'boolean') {
        throw new Error("Show compass incorrect");
    }
    if (gaugeControls.showGreenScreen !== undefined && typeof gaugeControls.showGreenScreen !== 'boolean') {
        throw new Error("Show green screen incorrect");
    }
    if (gaugeControls.showRouteLine !== undefined && typeof gaugeControls.showRouteLine !== 'boolean') {
        throw new Error("Show route line incorrect");
    }
    if (gaugeControls.showRoutePoints !== undefined && typeof gaugeControls.showRoutePoints !== 'boolean') {
        throw new Error("Show route points incorrect");
    }
    if (gaugeControls.showZoom !== undefined && typeof gaugeControls.showZoom !== 'boolean') {
        throw new Error("Show zoom incorrect");
    }
};
