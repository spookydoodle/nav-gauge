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
        left: '50%',
        width: 40,
        marginLeft: -20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    segment: { flex: 1 },
});

interface Props {
    state: RouteStoryState;
    onCurrentPointClick: () => void;
    onActiveClick: () => void;
    onInactiveClick: () => void;
    activeMenuLabel: string;
    inactiveMenuLabel: string;
    currentPointMenuLabel: string;
    activeRef: RefObject<HostInstance | null>;
    currentPointRef: RefObject<HostInstance | null>;
    inactiveRef: RefObject<HostInstance | null>;
}

export const DemoLine: FC<Props> = ({
    state,
    onCurrentPointClick,
    onActiveClick,
    onInactiveClick,
    activeMenuLabel,
    inactiveMenuLabel,
    currentPointMenuLabel,
    activeRef,
    currentPointRef,
    inactiveRef,
}) => {
    const markerSize = 16 * state.currentPoint.size;
    const icon = state.currentPoint.icon === 'Circle' ? Icons.Circle : Icons.NounProject[state.currentPoint.icon];

    return (
        <View style={styles['demo-line']} pointerEvents="box-none">
            <Pressable ref={activeRef} style={styles.segment} accessibilityRole="button" accessibilityLabel={activeMenuLabel} onPress={onActiveClick}><DemoLineSegment {...state.routeStyleActive} /></Pressable>
            <Pressable ref={inactiveRef} style={styles.segment} accessibilityRole="button" accessibilityLabel={inactiveMenuLabel} onPress={onInactiveClick}><DemoLineSegment {...state.routeStyleInactive} /></Pressable>
            <Pressable
                ref={currentPointRef}
                style={styles['demo-point']}
                accessibilityRole="button"
                accessibilityLabel={currentPointMenuLabel}
                onPress={onCurrentPointClick}
            >
                <Icon icon={icon} width={markerSize} height={markerSize} color={state.currentPoint.fillColor} />
            </Pressable>
        </View>
    );
};
