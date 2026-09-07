import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Radio } from "./Radio";
import { Text } from "../../typography";
import { ColorVariant, SizeVariant } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 4,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    label: {
        width: 40,
    },
});

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const RadioVariants: FC = () => {
    const [option, setOption] = useState('first');
    const [size, setSize] = useState<SizeVariant>('sm');
    const [color, setColor] = useState<ColorVariant>('primary');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <Radio
                    size={size}
                    color={color}
                    checked={option === 'first'}
                    onChange={() => setOption('first')}
                >
                    First option
                </Radio>
                <Radio
                    size={size}
                    color={color}
                    checked={option === 'second'}
                    onChange={() => setOption('second')}
                >
                    Second option
                </Radio>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Size</Text>
                <View style={styles.row}>
                    {allSizes.map(s => (
                        <Radio
                            key={s}
                            size="xs"
                            color={color}
                            checked={size === s}
                            onChange={() => setSize(s)}
                        >
                            {s}
                        </Radio>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.row}>
                    {allColors.map(c => (
                        <Radio
                            key={c}
                            size="xs"
                            color={c}
                            checked={color === c}
                            onChange={() => setColor(c)}
                        >
                            {c}
                        </Radio>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text>All combinations (checked)</Text>
                {allSizes.map(s => (
                    <View key={s} style={styles.row}>
                        <Text style={styles.label}>{s}</Text>
                        {allColors.map(c => (
                            <Radio key={c} size={s} color={c} checked onChange={() => { }}>
                                {c}
                            </Radio>
                        ))}
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text>All combinations (unchecked)</Text>
                {allSizes.map(s => (
                    <View key={s} style={styles.row}>
                        <Text style={styles.label}>{s}</Text>
                        {allColors.map(c => (
                            <Radio key={c} size={s} color={c} checked={false} onChange={() => { }}>
                                {c}
                            </Radio>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};