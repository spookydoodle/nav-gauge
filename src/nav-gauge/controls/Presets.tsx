import { FC, useEffect } from "react";
import { ControlPlacement, defaultGaugeControls, GaugeControls } from "./GaugeControls";
import { defaultMapLayout, racingGameMapLayout, MapLayout } from "./MapLayoutControls";
import { validateGaugeControls, validateMapLayout } from "../../logic";
import * as styles from './controls.module.css';

export type Preset = 'default' | 'racing-game' | 'test1' | '';

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
        value: 'racing-game',
        label: 'Racing game',
        mapLayout: racingGameMapLayout,
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

    const handleExport = () => {
        const jsonString = JSON.stringify({ mapLayout, gaugeControls }, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'Nav gauge preset';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (!file) {
            return;
        }
        file
            .text()
            .then((text) => {
                try {
                    const result = JSON.parse(text);
                    const possibleMapLayout = { defaultMapLayout, ...(result.mapLayout as MapLayout) };
                    const possibleGaugeControls = { defaultGaugeControls, ...(result.gaugeControls as GaugeControls) };
                    validateMapLayout(possibleMapLayout);
                    validateGaugeControls(possibleGaugeControls);
                    onPresetChange(detectPreset(possibleMapLayout, possibleGaugeControls), possibleMapLayout, possibleGaugeControls);
                } catch (e) {
                    console.error(e);
                }
            })
            .catch(console.error);
    };

    return (
        <div className={styles['presets']}>
            <div>
                <label htmlFor="presets">Preset</label>
                <select name="presets" id="presets" value={preset} onChange={handleChange}>
                    <option value="" disabled defaultValue="">Custom</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles['export-import']}>
                <button onClick={handleExport}>Export</button>
                <button onClick={() => document.getElementById('import-preset')?.click()}>Import</button>
                <input id="import-preset" type="file" accept='json' onChange={handleImport} className={styles['import-input']} />
            </div>
        </div>
    );
};
