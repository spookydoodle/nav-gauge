import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Fieldset } from "./Fieldset";
import { Checkbox } from "../checkbox";
import { Text } from "../../typography";
import { ColorVariant, SizeVariant, SurfaceFillVariant } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
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
});

const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allSizes: SizeVariant[] = ['xs', 'sm', 'md'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const FieldsetVariants: FC = () => {
    const [color, setColor] = useState<ColorVariant>('neutral');
    const [size, setSize] = useState<SizeVariant>('md');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Fieldset label="Preview" color={color} size={size}>
                <Text>Current: color={color}, size={size}</Text>
            </Fieldset>

            <View style={styles.section}>
                <Text>Color</Text>
                <View style={styles.row}>
                    {allColors.map(c => (
                        <Checkbox
                            key={c}
                            size="xs"
                            color={c}
                            checked={color === c}
                            onChange={() => setColor(c)}
                        >
                            {c}
                        </Checkbox>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text>Size</Text>
                <View style={styles.row}>
                    {allSizes.map(s => (
                        <Checkbox
                            key={s}
                            size="xs"
                            checked={size === s}
                            onChange={() => setSize(s)}
                        >
                            {s}
                        </Checkbox>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                {allVariants.map(variant => (
                    <Fieldset key={variant} label={variant} color="neutral" variant={variant}>
                        <Text>Neutral {variant} fieldset</Text>
                    </Fieldset>
                ))}
            </View>

            <View style={styles.section}>
                <Fieldset label="Expandable" expandable color="secondary">
                    <Text>Tap the legend to toggle.</Text>
                </Fieldset>
            </View>

            <View style={styles.section}>
                <Fieldset label="With Prepend" prepend={<Text>&#9881;</Text>} color="tertiary">
                    <Text>Fieldset with prepend element.</Text>
                </Fieldset>
            </View>
        </ScrollView>
    );
};
