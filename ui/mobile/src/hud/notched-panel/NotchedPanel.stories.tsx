import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../button';
import { Text } from '../../typography';
import { NotchedPanel } from './NotchedPanel';

const styles = StyleSheet.create({
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 18 },
    showcase: { gap: 16 },
});

export const NoHeader: FC = () => (
    <NotchedPanel color="primary" variant="fill-translucent" padding="md"><Text>Responsive navigation telemetry surface.</Text></NotchedPanel>
);

export const Header: FC = () => (
    <NotchedPanel color="neutral" highlightColor="secondary" header={<Text>WARNING</Text>} padding="md"><Text>Route data contains unresolved segments.</Text></NotchedPanel>
);

export const Variants: FC = () => (
    <View style={styles.showcase}>
        <NotchedPanel color="primary" variant="fill" header={<Text>FILL</Text>} padding="sm"><Text>Primary</Text></NotchedPanel>
        <NotchedPanel color="secondary" variant="fill-inverse" header={<Text>INVERSE</Text>} padding="sm" glowStyle="glow"><Text>Secondary</Text></NotchedPanel>
        <NotchedPanel color="tertiary" variant="fill-translucent" header={<Text>TRANSLUCENT</Text>} padding="sm" glowStyle="animate-borders-glow"><Text>Tertiary</Text></NotchedPanel>
    </View>
);

export const Confirmation: FC = () => (
    <NotchedPanel accessibilityRole="alert" color="neutral" highlightColor="primary" header={<Text>CONFIRM ROUTE DELETION</Text>} padding="md">
        <Text>This removes the selected route from local storage.</Text>
        <View style={styles.actions}>
            <Button variant="ghost">Cancel</Button>
            <Button color="primary" variant="fill">Delete route</Button>
        </View>
    </NotchedPanel>
);
