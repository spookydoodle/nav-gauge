import { ControlPlacement, defaultGaugeControls, defaultMapLayout, GaugeControlsType, MapLayout } from "../../../tinker-chest/src";
import { AnimationControlsType, Animatrix } from "../state";

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

export class PresetStation {
    public constructor() { }

    private static racingGameMapLayout: MapLayout = {
        size: {
            type: 'manual',
            width: 400,
            height: 400
        },
        borderWidth: 5,
        borderColor: '#ff0000',
        borderRadius: '50%',
        innerBorderWidth: 0,
        innerBorderColor: '#000000',
        boxShadow: '0px 0px 16px #ff0000, 0px 0px 16px #ff0000',
        innerBoxShadow: '',
    };

    public static presetOptions: PresetOption[] = [
        {
            value: 'default',
            label: 'Default',
            mapLayout: defaultMapLayout,
            gaugeControls: defaultGaugeControls,
            animationControls: Animatrix.defaultControls,
        },
        {
            value: 'racing-game',
            label: 'Racing game',
            mapLayout: PresetStation.racingGameMapLayout,
            gaugeControls: defaultGaugeControls,
            animationControls: Animatrix.defaultControls,
        },
    ];

    public static detectPreset = (
        mapLayout: MapLayout,
        { controlPlacement, ...gaugeControls }: GaugeControlsType,
    ): Preset => {
        return PresetStation.presetOptions.find((option) => (
            Object.entries(mapLayout).every(([key, value]) => option.mapLayout[key as keyof MapLayout] === value) &&
            Object.entries(gaugeControls).every(([key, value]) => option.gaugeControls[key as keyof GaugeControlsType] === value) &&
            Object.entries(controlPlacement).every(([key, value]) => option.gaugeControls.controlPlacement[key as keyof ControlPlacement] === value)
        ))?.value ?? "";
    };
}