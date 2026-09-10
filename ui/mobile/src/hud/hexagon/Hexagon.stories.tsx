import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ColorVariant, SizeVariant, SurfaceVariant } from '@ui';
import { Text } from '../../typography';
import { Hexagon } from './Hexagon';

const styles = StyleSheet.create({
    container: { gap: 24, padding: 16 },
    section: { gap: 10 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    cell: { alignItems: 'center', gap: 8 },
    heading: { fontWeight: '700' },
    fixedWidth: { width: 100 },
});
const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const variants: SurfaceVariant[] = ['ghost', 'fill', 'fill-inverse', 'fill-translucent', 'outline', 'inset'];

export const Default: FC = () => <Hexagon color="primary" variant="fill-translucent" size="md"><Text>Preview</Text></Hexagon>;

export const Variants: FC = () => (
    <ScrollView contentContainerStyle={styles.container}>
        {variants.map((variant) => <View key={variant} style={styles.section}><Text style={styles.heading}>{variant}</Text><View style={styles.grid}>{colors.map((color) => <View key={color} style={styles.cell}><Text>{color}</Text><Hexagon color={color} variant={variant}><Text>Preview</Text></Hexagon></View>)}</View></View>)}
    </ScrollView>
);

export const SizesAndShapes: FC = () => (
    <ScrollView contentContainerStyle={styles.container}>
        {(['pointy-top', 'flat-top'] as const).map((shape) => <View key={shape} style={styles.section}><Text style={styles.heading}>{shape}</Text><View style={styles.grid}>{(['xs', 'sm', 'md'] as SizeVariant[]).map((size) => <View key={size} style={styles.cell}><Text>{size}</Text><Hexagon shape={shape} size={size} color="tertiary" /></View>)}</View></View>)}
        <View style={styles.section}><Text style={styles.heading}>Stroke width</Text><View style={styles.grid}>{[1, 3, 5].map((strokeWidth) => <View key={strokeWidth} style={styles.cell}><Text>{strokeWidth}px</Text><Hexagon strokeWidth={strokeWidth} color="primary" style={styles.fixedWidth} /></View>)}</View></View>
    </ScrollView>
);

export const InteractiveGlow: FC = () => <View style={styles.grid}><Hexagon interactive color="primary" style={styles.fixedWidth}><Text>Default</Text></Hexagon><Hexagon interactive glowStyle="glow" color="secondary" style={styles.fixedWidth}><Text>Glow</Text></Hexagon><Hexagon interactive glowStyle="animate-borders-glow" color="tertiary" style={styles.fixedWidth}><Text>Borders</Text></Hexagon></View>;
