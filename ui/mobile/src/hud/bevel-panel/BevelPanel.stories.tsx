import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ColorVariant, SurfaceFillVariant } from '@ui';
import { Text } from '../../typography';
import { BevelPanel } from './BevelPanel';

const styles = StyleSheet.create({
    container: { gap: 24, padding: 16 },
    section: { gap: 10 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    cell: { flexBasis: 140, flexGrow: 1, gap: 8 },
    heading: { fontWeight: '700' },
});
const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const variants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const Default: FC = () => <BevelPanel color="primary" variant="fill-translucent" padding="md"><Text>Preview</Text></BevelPanel>;
export const Variants: FC = () => <ScrollView contentContainerStyle={styles.container}>{variants.map((variant) => <View key={variant} style={styles.section}><Text style={styles.heading}>{variant}</Text><View style={styles.grid}>{colors.map((color) => <View key={color} style={styles.cell}><Text>{color}</Text><BevelPanel color={color} variant={variant} padding="md"><Text>Preview</Text></BevelPanel></View>)}</View></View>)}</ScrollView>;
export const InteractiveGlow: FC = () => <View style={styles.grid}><BevelPanel interactive color="primary" padding="md"><Text>Default glow</Text></BevelPanel><BevelPanel interactive glowStyle="glow" color="secondary" padding="md"><Text>Glow</Text></BevelPanel><BevelPanel interactive glowStyle="animate-borders-glow" color="tertiary" padding="md"><Text>Borders</Text></BevelPanel></View>;
