import { FC } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NumberInputProps, useTheme } from "@ui";

export const NumberInput: FC<NumberInputProps> = ({
    color = 'neutral',
    size = 'sm',
    label,
    value,
    onChange,
    disabled = false,
    unit,
}) => {
    const theme = useTheme();

    const handleChange = (text: string) => {
        const parsed = Number(text);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    };

    const baseColor = theme.color(color, 500);
    const labelFontSize = size === 'xs' ? 11 : size === 'sm' ? 12 : 13;
    const inputFontSize = size === 'xs' ? 12 : size === 'sm' ? 14 : 16;
    const padding = size === 'xs' ? 4 : size === 'sm' ? 6 : 8;

    return (
        <View style={styles.container}>
            {label ? <Text style={[styles.label, { color: baseColor, fontSize: labelFontSize }]}>{label}</Text> : null}
            <View style={styles['input-wrapper']}>
                <TextInput
                    style={[
                        styles.input,
                        unit && styles['input-with-unit'],
                        {
                            color: baseColor,
                            borderColor: baseColor,
                            fontSize: inputFontSize,
                            padding,
                        },
                    ]}
                    value={String(value)}
                    onChangeText={handleChange}
                    keyboardType="numeric"
                    editable={!disabled}
                />
                {unit ? <Text style={[styles.unit, { color: baseColor, fontSize: inputFontSize }]}>{unit}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        rowGap: 4,
    },
    label: {
        fontSize: 12,
    },
    'input-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 14,
    },
    'input-with-unit': {
        flex: 1,
    },
    unit: {
        fontSize: 14,
        marginLeft: 4,
        opacity: 0.6,
    },
});
