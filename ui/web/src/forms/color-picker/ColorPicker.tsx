import { FC, useMemo } from "react";
import classNames from "classnames";
import { ColorPickerProps, getThemeColorSwatches, parseColor, toCssColor, toHexColor, useTheme } from "@ui";
import { Slider } from "../slider";
import styles from './color-picker.module.css';

export const ColorPicker: FC<ColorPickerProps> = ({ label, value, onChange, opacityLabel }) => {
    const theme = useTheme();
    const parsed = useMemo(() => parseColor(value), [value]);
    const swatches = useMemo(() => getThemeColorSwatches(theme), [theme]);

    const handleNativePick = (nextHex: string) => {
        onChange(toCssColor({ ...parseColor(nextHex), a: parsed.a }));
    };

    const handleSwatch = (swatchColor: string) => {
        onChange(toCssColor({ ...parseColor(swatchColor), a: parsed.a }));
    };

    const handleAlpha = (nextAlpha: number) => {
        onChange(toCssColor({ ...parsed, a: nextAlpha }));
    };

    const borderColor = theme.componentColor('border');

    return (
        <div className={styles.container}>
            <div className={styles['header']}>
                <span
                    className={styles['preview']}
                    style={{ backgroundColor: value, borderColor }}
                    aria-hidden="true"
                />
                <span className={styles['value']}>{value}</span>
            </div>

            <div className={styles['swatch-grid']}>
                {swatches.map((swatch) => (
                    <button
                        key={swatch.label}
                        type="button"
                        title={swatch.label}
                        aria-label={swatch.label}
                        className={classNames(styles['swatch-button'], {
                            [styles['selected']]: value === swatch.color,
                        })}
                        style={{ backgroundColor: swatch.color, borderColor }}
                        onClick={() => handleSwatch(swatch.color)}
                    />
                ))}
            </div>

            <div className={styles['ramp']}>
                <input
                    type="color"
                    className={styles['native-picker']}
                    value={toHexColor(parsed)}
                    onChange={(event) => handleNativePick(event.target.value)}
                    aria-label={label ? `${label} color ramp` : 'Color ramp'}
                />
                {opacityLabel ? <span className={styles['opacity-label']}>{opacityLabel}</span> : null}
                <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={parsed.a}
                    onChange={handleAlpha}
                    aria-label={label ? `${label} opacity` : 'Opacity'}
                />
            </div>
        </div>
    );
};