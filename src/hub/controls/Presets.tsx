import { FC, useEffect } from "react";
import { AnimationControlsType, Animatrix, Preset, PresetStation, PresetValues } from "../../apparatus";
import {
    applyGaugeControls,
    defaultGaugeControls,
    defaultMapLayout,
    GaugeControlsType,
    MapLayout,
    validateGaugeControls,
    validateMapLayout,
} from "../../tinker-chest";
import { useStateWarden } from "../../contexts";
import { useSubjectState } from "../../hooks";
import * as styles from './controls.module.css';

interface Props {
    preset: Preset;
    onPresetChange: (preset: Preset, presetValues?: PresetValues) => void;
    mapLayout: MapLayout;
    gaugeControls: GaugeControlsType;
}

export const Presets: FC<Props> = ({
    preset,
    onPresetChange,
    mapLayout,
    gaugeControls,
}) => {
    const { animatrix } = useStateWarden();
    const [animationControls] = useSubjectState(animatrix.controls$);

    useEffect(() => {
        if (preset && !PresetStation.detectPreset(mapLayout, gaugeControls)) {
            onPresetChange("");
        }
    }, [mapLayout, gaugeControls]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextPreset = event.target.value as Preset;
        const option = PresetStation.presetOptions.find((option) => option.value === nextPreset);
        if (!option) {
            return;
        }
        onPresetChange(nextPreset, {
            presetMapLayout: option.mapLayout,
            presetGaugeControls: option.gaugeControls,
            presetAnimationControls: option.animationControls,
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
                    Animatrix.validateAnimationControls(possibleAnimationControls);

                    onPresetChange(PresetStation.detectPreset(possibleMapLayout, possibleGaugeControls), {
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
                    {PresetStation.presetOptions.map((option) => (
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
