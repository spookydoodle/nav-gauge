import { FC, useEffect } from "react";
import { defaultGaugeControls, defaultMapLayout, detectPreset, GaugeControlsType, MapLayout, Preset, presetOptions, racingGameMapLayout, validateGaugeControls, validateMapLayout } from "../../logic";
import * as styles from './controls.module.css';

interface Props {
    preset: Preset;
    onPresetChange: (preset: Preset, mapLayout?: MapLayout, gaugeControls?: GaugeControlsType) => void;
    mapLayout: MapLayout;
    gaugeControls: GaugeControlsType;
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
        const option = presetOptions.find((option) => option.value === nextPreset);
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
                    const possibleGaugeControls = { defaultGaugeControls, ...(result.gaugeControls as GaugeControlsType) };
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
            {/* TODO: Move to reusable component */}
            <div>
                <label htmlFor="presets" style={{ fontSize: "12px" }}>Preset</label>
                <select name="presets" id="presets" value={preset} onChange={handleChange}>
                    <option value="" disabled defaultValue="">Custom</option>
                    {presetOptions.map((option) => (
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
