import { FC, useState } from "react";
import { ScrollView, View, Switch, Text, StyleSheet } from "react-native";
import { NumberInput } from "./NumberInput";
import { ColorVariant, SizeVariant } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    section: {
        paddingVertical: 12,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export const NumberInputInteractive: FC = () => {
    const [value, setValue] = useState(50);
    const [color, setColor] = useState<ColorVariant>('neutral');
    const [size, setSize] = useState<SizeVariant>('sm');
    const [disabled, setDisabled] = useState(false);

    const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
    const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <NumberInput
                label="Value"
                value={value}
                onChange={setValue}
                color={color}
                size={size}
                disabled={disabled}
                step={0.1}
            />

            <View style={styles.section}>
                <Text style={styles.label}>Current value: {value}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.row}>
                    {allColors.map(c => (
                        <Switch key={c} value={color === c} onValueChange={() => setColor(c)} />
                    ))}
                </View>
                <Text>{color}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Size</Text>
                <View style={styles.row}>
                    {allSizes.map(s => (
                        <Switch key={s} value={size === s} onValueChange={() => setSize(s)} />
                    ))}
                </View>
                <Text>{size}</Text>
            </View>

            <View style={styles.row}>
                <Text>Disabled:</Text>
                <Switch value={disabled} onValueChange={setDisabled} />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>All colors</Text>
                {allColors.map(c => (
                    <NumberInput key={c} label={c} value={42} onChange={() => { }} color={c} />
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>All sizes</Text>
                {allSizes.map(s => (
                    <NumberInput key={s} label={s} value={42} onChange={() => { }} size={s} />
                ))}
            </View>
        </ScrollView>
    );
};
