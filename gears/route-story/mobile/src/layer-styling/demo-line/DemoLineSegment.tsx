import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { RouteStoryLineStyle } from "@the-dead-planet/nav-gauge-gears-route-story-common";

const styles = StyleSheet.create({
    dashedOutline: {
        width: '100%',
        height: 0,
        borderStyle: 'dashed',
        justifyContent: 'center',
    },
    dashed: {
        height: 0,
        borderStyle: 'dashed',
    },
    solidOutline: {
        width: '100%',
        justifyContent: 'center',
    },
});

export const DemoLineSegment: FC<RouteStoryLineStyle> = ({
    color,
    outlineColor,
    width,
    outlineWidth,
    variant,
}) => {
    const lineWidth = Math.max(2, Math.min(width, 10));
    const outlineSize = lineWidth + outlineWidth * 2;

    if (variant === 'dashed') {
        return (
            <View style={[styles.dashedOutline, { borderTopWidth: outlineSize, borderTopColor: outlineColor }]}>
                <View style={[styles.dashed, { borderTopWidth: lineWidth, borderTopColor: color, }]} />
            </View>
        );
    }

    return (
        <View style={[styles.solidOutline, { height: outlineSize, backgroundColor: outlineColor }]}>
            <View style={{ height: lineWidth, backgroundColor: color }} />
        </View>
    );
};
