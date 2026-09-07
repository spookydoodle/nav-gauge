import { FC, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ColorPicker } from "./ColorPicker";

const styles = StyleSheet.create({
    container: { padding: 16, gap: 16 },
    section: { paddingVertical: 12, gap: 8 },
    label: { fontSize: 14, fontWeight: '600' },
});

export const ColorPickerInteractive: FC = () => {
    const [value, setValue] = useState('rgba(255, 102, 0, 0.8)');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ColorPicker label="Line color" value={value} onChange={setValue} />

            <View style={styles.section}>
                <Text style={styles.label}>Current value: {value}</Text>
            </View>
        </ScrollView>
    );
};