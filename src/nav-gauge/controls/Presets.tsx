import { Dispatch, FC, SetStateAction, useEffect } from "react";
import * as styles from './controls.module.css';
import { ControlPlacement, defaultGaugeControls, GaugeControls } from "./GaugeControls";
import { defaultMapLayout, MapLayout } from "./MapLayoutControls";

export type Preset = 'default' | 'test1' | '';

export interface PresetOption {
    value: Preset;
    label: string;
    mapLayout: MapLayout;
    gaugeControls: GaugeControls;
}

const options: PresetOption[] = [
        {
            value: 'default',
            label: 'Default',
            mapLayout: defaultMapLayout,
            gaugeControls: defaultGaugeControls,
        },
        {
            value: 'test1',
            label: 'Test 1',
            mapLayout: {
                ...defaultMapLayout,
                borderColor: '#ffff00'
            },
            gaugeControls: defaultGaugeControls,
        },
    ];

export const detectPreset = (
    mapLayout: MapLayout,
    { controlPlacement, ...gaugeControls }: GaugeControls,
): Preset => {
    return options.find((option) => (
        Object.entries(mapLayout).every(([key, value]) => option.mapLayout[key as keyof MapLayout] === value) &&
        Object.entries(gaugeControls).every(([key, value]) => option.gaugeControls[key as keyof GaugeControls] === value) &&
        Object.entries(controlPlacement).every(([key, value]) => option.gaugeControls.controlPlacement[key as keyof ControlPlacement] === value)
    ))?.value ?? "";
};

interface Props {
    preset: Preset;
    onPresetChange: (preset: Preset, mapLayout?: MapLayout, gaugeControls?: GaugeControls) => void;
    mapLayout: MapLayout;
    gaugeControls: GaugeControls;
}

export const Presets: FC<Props> = ({
    preset,
    onPresetChange,
    mapLayout,
    gaugeControls,
}) => {
    useEffect(() => {
        if (preset && !detectPreset(mapLayout, gaugeControls)) {
            onPresetChange("");
        }
    }, [mapLayout, gaugeControls]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextPreset = event.target.value as Preset;
        const option = options.find((option) => option.value === nextPreset);
        onPresetChange(nextPreset, option?.mapLayout, option?.gaugeControls);
    };

    const handleExport = () => { };
    const handleImport = () => { };

    return (
        <div className={styles['presets']}>
            <div>
                <label htmlFor="presets">Preset</label>
                <select name="presets" id="presets" value={preset} onChange={handleChange}>
                    <option value="" disabled selected>Custom</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles['export-import']}>
                <button onClick={handleExport}>Export</button>
                <button onClick={handleImport}>Import</button>
            </div>
        </div>
    );
};
