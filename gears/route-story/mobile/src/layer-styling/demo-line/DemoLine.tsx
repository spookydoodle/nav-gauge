import { FC, RefObject } from "react";
import { HostInstance, Pressable, StyleSheet, View } from "react-native";
import { RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { DemoLineSegment } from "./DemoLineSegment";

const styles = StyleSheet.create({
    'demo-line': {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    'demo-point': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    'demo-point-outline': {
        position: 'absolute',
    },
    'demo-point-fill': {
        position: 'absolute',
    },
    'active-anchor': { position: 'absolute', left: '25%', width: 1, height: 1 },
    'inactive-anchor': { position: 'absolute', left: '75%', width: 1, height: 1 },
});

interface Props {
    state: RouteStoryState;
    onCurrentPointClick: () => void;
    currentPointMenuLabel: string;
    activeRef: RefObject<HostInstance | null>;
    currentPointRef: RefObject<HostInstance | null>;
    inactiveRef: RefObject<HostInstance | null>;
}

export const DemoLine: FC<Props> = ({
    state,
    onCurrentPointClick,
    currentPointMenuLabel,
    activeRef,
    currentPointRef,
    inactiveRef,
}) => {
    const radius = state.currentPoint.size;

    return (
        <View style={styles['demo-line']} pointerEvents="box-none">
            <DemoLineSegment {...state.routeStyleActive} />
            <DemoLineSegment {...state.routeStyleInactive} />
            <View ref={activeRef} style={styles['active-anchor']} pointerEvents="none" accessibilityElementsHidden />
            <View ref={inactiveRef} style={styles['inactive-anchor']} pointerEvents="none" accessibilityElementsHidden />
            <Pressable
                ref={currentPointRef}
                style={styles['demo-point']}
                accessibilityRole="button"
                accessibilityLabel={currentPointMenuLabel}
                onPress={onCurrentPointClick}
            >
                <View
                    style={[styles['demo-point-outline'], {
                        width: (radius + 2) * 2,
                        height: (radius + 2) * 2,
                        borderRadius: radius + 2,
                        backgroundColor: state.currentPoint.outlineColor,
                    }]}
                    pointerEvents="none"
                />
                <View
                    style={[styles['demo-point-fill'], {
                        width: radius * 2,
                        height: radius * 2,
                        borderRadius: radius,
                        backgroundColor: state.currentPoint.fillColor,
                    }]}
                    pointerEvents="none"
                />
            </Pressable>
        </View>
    );
};
