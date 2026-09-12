import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { RouteStoryLineStyle } from "@the-dead-planet/nav-gauge-gears-route-story-common";

const styles = StyleSheet.create({
    segment: {
        width: '100%',
        height: 20,
        justifyContent: 'center',
    },
    dashedOutline: {
        width: '100%',
        height: 0,
        borderStyle: 'dashed',
        justifyContent: 'center',
    },
    dashed: {
        width: '100%',
        height: 0,
        borderStyle: 'dashed',
    },
    solidOutline: {
        width: '100%',
        justifyContent: 'center',
    },
    point: {
        position: 'absolute',
        borderRadius: 999,
    },
});

export const DemoLineSegment: FC<RouteStoryLineStyle> = ({
    color,
    outlineColor,
    width,
    outlineWidth,
    variant,
    showRouteLine,
    showRoutePoints,
    pointColor,
    pointRadius,
}) => {
    const lineWidth = Math.min(width, 10);
    const outlineSize = lineWidth + outlineWidth * 2;

    return (
        <View style={styles.segment}>
            {showRouteLine && variant === 'dashed' && (
                outlineWidth > 0
                    ? <View style={[styles.dashedOutline, { borderTopWidth: outlineSize, borderTopColor: outlineColor }]}>
                        <View style={[styles.dashed, { borderTopWidth: lineWidth, borderTopColor: color }]} />
                    </View>
                    : <View style={[styles.dashed, { borderTopWidth: lineWidth, borderTopColor: color }]} />
            )}
            {showRouteLine && variant === 'solid' && (
                <View style={[styles.solidOutline, { height: outlineSize, backgroundColor: outlineColor }]}>
                    <View style={{ height: lineWidth, backgroundColor: color }} />
                </View>
            )}
            {showRoutePoints && ['20%', '50%', '80%'].map((left) => (
                <View key={left} style={[styles.point, { left, top: 10 - pointRadius, width: pointRadius * 2, height: pointRadius * 2, backgroundColor: pointColor }]} />
            ))}
        </View>
    );
};
