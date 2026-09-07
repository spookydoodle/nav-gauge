import { FC, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ColorPickerProps, getThemeColorSwatches, hslToRgb, rgbToHsl, toCssColor, parseColor, useTheme } from "@ui";
import { Slider } from "../slider";
import { Text } from "../../typography";

export const ColorPicker: FC<ColorPickerProps> = ({ label, value, onChange, opacityLabel }) => {
    const theme = useTheme();
    const parsed = useMemo(() => parseColor(value), [value]);
    const { h, s, l } = useMemo(() => rgbToHsl(parsed), [parsed]);
    const swatches = useMemo(() => getThemeColorSwatches(theme), [theme]);
    const borderColor = theme.componentColor('border');

    const handleHsl = (nextH: number, nextS: number, nextL: number) => {
        onChange(toCssColor({ ...hslToRgb({ h: nextH, s: nextS, l: nextL }), a: parsed.a }));
    };

    const handleSwatch = (swatchColor: string) => {
        onChange(toCssColor({ ...parseColor(swatchColor), a: parsed.a }));
    };

    const handleAlpha = (nextAlpha: number) => {
        onChange(toCssColor({ ...parsed, a: nextAlpha }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.preview, { backgroundColor: value, borderColor }]} />
                <Text style={styles.value}>{value}</Text>
            </View>

            <View style={styles['swatch-grid']}>
                {swatches.map((swatch) => (
                    <Pressable
                        key={swatch.label}
                        onPress={() => handleSwatch(swatch.color)}
                        style={[styles['swatch-button'], { backgroundColor: swatch.color, borderColor }]}
                        accessibilityLabel={swatch.label}
                    />
                ))}
            </View>

            <Slider min={0} max={360} step={1} value={h} onChange={(nextH) => handleHsl(nextH, s, l)} label="Hue" />
            <Slider min={0} max={100} step={1} value={s} onChange={(nextS) => handleHsl(h, nextS, l)} label="Saturation" />
            <Slider min={0} max={100} step={1} value={l} onChange={(nextL) => handleHsl(h, s, nextL)} label="Lightness" />
            <Slider min={0} max={1} step={0.05} value={parsed.a} onChange={handleAlpha} label={opacityLabel} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
    },
    value: {
        fontSize: 11,
        opacity: 0.7,
    },
    preview: {
        width: 22,
        height: 22,
        borderWidth: 1,
        borderRadius: 4,
    },
    'swatch-grid': {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    'swatch-button': {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 3,
    },
});