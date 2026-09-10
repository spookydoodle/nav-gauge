import { FC, useRef } from 'react';
import { HostInstance, StyleSheet, View } from 'react-native';
import { HudDecoration } from '../decoration';
import { Panel } from '../panel';
import { Text } from '../../typography';
import { HudConnector } from './HudConnector';

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 32, width: '100%' },
});

export const Anchors: FC = () => {
    const fromRef = useRef<HostInstance>(null);
    const toRef = useRef<HostInstance>(null);
    return (
        <HudConnector fromRef={fromRef} toRef={toRef} fromAnchor="right" toAnchor="left" color="secondary" glowStyle="glow">
            <View style={styles.row}>
                <View ref={fromRef}><HudDecoration><Panel variant="fill-inverse" padding="md"><Text>Navigation</Text></Panel></HudDecoration></View>
                <View ref={toRef}><HudDecoration corners={['top-right', 'bottom-left']}><Panel variant="fill-inverse" padding="md"><Text>Telemetry</Text></Panel></HudDecoration></View>
            </View>
        </HudConnector>
    );
};
