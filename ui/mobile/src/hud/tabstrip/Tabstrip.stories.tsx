import { FC, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ColorVariant, TabstripOption, TabstripVariant } from '@ui';
import { Tabstrip } from './Tabstrip';
import { Text } from '../../typography';

const options: TabstripOption[] = [
    { value: 'route', label: 'Route' },
    { value: 'waypoints', label: 'Waypoints' },
    { value: 'terrain', label: 'Terrain' },
    { value: 'weather', label: 'Weather' },
    { value: 'telemetry', label: 'Telemetry' },
    { value: 'export', label: 'Export' },
];
const content: Record<string, string> = {
    route: 'Configure the route line, direction, and playback behavior.\nAdjust its color, width, points, and outline.\nPreview the result before exporting.',
    waypoints: 'Review waypoint labels and marker visibility.',
    terrain: 'Adjust terrain exaggeration and contour details.',
    weather: 'Inspect wind, cloud, and precipitation overlays.',
    telemetry: 'Monitor speed, elevation, and recording statistics.',
    export: 'Export the finished route story.',
};
const styles = StyleSheet.create({
    container: { padding: 16, gap: 20 },
    constrained: { width: 260 },
    title: { fontWeight: '700', marginBottom: 6 },
});

export const Responsive: FC = () => {
    const [value, setValue] = useState('export');
    return (
        <View style={styles.constrained}>
            <Tabstrip options={options} value={value} onChange={setValue} highlightColor="primary" overflowAccessibilityLabel="More tabs">
                <Text>{content[value]}</Text>
            </Tabstrip>
        </View>
    );
};

export const Spread: FC = () => {
    const [value, setValue] = useState('route');
    return (
        <View style={{ width: '100%', padding: 16 }}>
            <Tabstrip spread options={[{ value: 'route', label: 'Active' }, { value: 'waypoints', label: 'Current point' }, { value: 'terrain', label: 'Inactive' }]} value={value} onChange={setValue} highlightColor="primary" overflowAccessibilityLabel="More tabs">
                <Text>{content[value]}</Text>
            </Tabstrip>
        </View>
    );
};

export const VariantsAndColors: FC = () => {
    const [value, setValue] = useState('route');
    const variants: TabstripVariant[] = ['fill-inverse', 'fill-translucent', 'outline'];
    const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {variants.flatMap((variant) => colors.map((color) => (
                <View key={`${variant}-${color}`}>
                    <Text style={styles.title}>{variant}, {color}</Text>
                    <Tabstrip options={options.slice(0, 3)} value={value} onChange={setValue} variant={variant} color={color} highlightColor={color} overflowAccessibilityLabel="More tabs">
                        <Text>{content[value]}</Text>
                    </Tabstrip>
                </View>
            )))}
        </ScrollView>
    );
};
