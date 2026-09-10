import { FC, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ColorVariant, GlowStyle, HudDecorationCorner, SizeVariant, TabstripOption } from '@ui';
import { HudDecoration } from './HudDecoration';
import { Panel } from '../panel';
import { Tabstrip } from '../tabstrip';
import { Text } from '../../typography';

const options: TabstripOption[] = [
    { value: 'route', label: 'Route' },
    { value: 'terrain', label: 'Terrain' },
];
const styles = StyleSheet.create({
    container: { gap: 24, padding: 16 },
    tabContent: { width: 220 },
    catalog: { gap: 24, padding: 16 },
    catalogGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
    catalogItem: { flexBasis: 140, flexGrow: 1, gap: 10 },
    cornerItem: { flexBasis: '45%', flexGrow: 1, gap: 10 },
    catalogLabel: { fontWeight: '700' },
    heading: { fontSize: 18, fontWeight: '700' },
});

export const Brackets: FC = () => {
    const [value, setValue] = useState('route');
    return (
        <View style={styles.container}>
            <HudDecoration color="secondary" size="md" glowStyle="glow">
                <Panel variant="fill-inverse" padding="md"><Text>Decorated panel</Text></Panel>
            </HudDecoration>
            <HudDecoration corners={['top-right', 'bottom-left']}>
                <View style={styles.tabContent}>
                    <Tabstrip options={options} value={value} onChange={setValue} highlightColor="primary" overflowAccessibilityLabel="More tabs">
                        <Text>Active: {value}</Text>
                    </Tabstrip>
                </View>
            </HudDecoration>
        </View>
    );
};

export const AllDecorations: FC = () => {
    const corners: HudDecorationCorner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    const sizes: SizeVariant[] = ['xs', 'sm', 'md'];
    const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
    const glowStyles: GlowStyle[] = ['none', 'glow', 'animate-borders-glow'];

    return (
        <ScrollView contentContainerStyle={styles.catalog}>
            <Text style={styles.heading}>Bracket corners</Text>
            <View style={styles.catalogGrid}>
                {corners.map((corner) => (
                    <View key={corner} style={styles.cornerItem}>
                        <Text style={styles.catalogLabel}>{corner}</Text>
                        <HudDecoration corners={[corner]}>
                            <Panel variant="fill-inverse" padding="sm"><Text>Preview</Text></Panel>
                        </HudDecoration>
                    </View>
                ))}
            </View>
            <Text style={styles.heading}>Sizes and colors by glow mode</Text>
            {glowStyles.map((glowStyle) => (
                <View key={glowStyle} style={styles.catalogItem}>
                    <Text style={styles.heading}>{glowStyle}</Text>
                    <View style={styles.catalogGrid}>
                        {sizes.flatMap((size) => colors.map((color) => (
                            <View key={`${size}-${color}`} style={styles.catalogItem}>
                                <Text style={styles.catalogLabel}>{size} / {color}</Text>
                                <HudDecoration size={size} color={color} glowStyle={glowStyle} corners={corners}>
                                    <Panel variant="fill-inverse" color={color} padding="sm"><Text>Preview</Text></Panel>
                                </HudDecoration>
                            </View>
                        )))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};
