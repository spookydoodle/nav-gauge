import { FC, RefObject } from "react";
import { HostInstance, Pressable, StyleSheet, View } from "react-native";
import { RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";
import { Icon } from "@mobile-ui";
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
    const markerSize = 16 * state.currentPoint.size;
    const icon = state.currentPoint.icon === 'Circle' ? Icons.Circle : Icons.NounProject[state.currentPoint.icon];

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
                <View style={{ backgroundColor: state.currentPoint.outlineColor, padding: state.currentPoint.outlineWidth }} pointerEvents="none">
                    <Icon icon={icon} width={markerSize} height={markerSize} color={state.currentPoint.fillColor} />
                </View>
            </Pressable>
        </View>
    );
};
