import { FC, useEffect } from "react";
import { AnimationControlsType, applyGaugeControls, defaultGaugeControls, defaultMapLayout, detectPreset, GaugeControlsType, MapLayout, Preset, presetOptions, PresetValues, validateAnimationControls, validateGaugeControls, validateMapLayout } from "../../logic";
import * as styles from './controls.module.css';
import { Animatrix } from "../../logic/state/animatrix";

interface Props {
    preset: Preset;
    onPresetChange: (preset: Preset, presetValues?: PresetValues) => void;
    mapLayout: MapLayout;
    gaugeControls: GaugeControlsType;
    animationControls: AnimationControlsType;
}

export const Presets: FC<Props> = ({
    preset,
    onPresetChange,
    mapLayout,
    gaugeControls,
    animationControls,
}) => {
    useEffect(() => {
        if (preset && !detectPreset(mapLayout, gaugeControls)) {
            onPresetChange("");
        }
    }, [mapLayout, gaugeControls]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextPreset = event.target.value as Preset;
        const option = presetOptions.find((option) => option.value === nextPreset);

        onPresetChange(nextPreset, {
            presetMapLayout: option?.mapLayout,
            presetGaugeControls: option?.gaugeControls,
            presetAnimationControls: option?.animationControls,
        });
    };

    const handleExport = () => {
        const jsonString = JSON.stringify({ mapLayout, gaugeControls, animationControls }, null, 2);
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
                    const possibleMapLayout: MapLayout = { ...defaultMapLayout, ...(result.mapLayout as MapLayout) };
                    validateMapLayout(possibleMapLayout);

                    const possibleGaugeControls: GaugeControlsType = { ...defaultGaugeControls, ...(result.gaugeControls as GaugeControlsType) };
                    validateGaugeControls(possibleGaugeControls);

                    const possibleAnimationControls = { ...Animatrix.defaultControls, ...(result.animationControls as AnimationControlsType) };
                    validateAnimationControls(possibleAnimationControls);

                    onPresetChange(detectPreset(possibleMapLayout, possibleGaugeControls), {
                        presetMapLayout: possibleMapLayout,
                        presetGaugeControls: applyGaugeControls(possibleGaugeControls),
                        presetAnimationControls: possibleAnimationControls
                    });
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
