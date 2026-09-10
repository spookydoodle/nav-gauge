import { FC } from "react";
import { StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { ColorVariant, SurfaceFillVariant, useTheme } from "@ui";

const styles = StyleSheet.create({
    bevelOutline: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    }
});

interface Props {
    containerWidth: number;
    containerHeight: number;
    bevel: number;
    color?: ColorVariant;
    variant?: SurfaceFillVariant;
}

export const FieldsetBevelOutline: FC<Props> = ({
    containerWidth,
    containerHeight,
    bevel,
    color,
    variant,
}) => {
    const theme = useTheme();
    const effectiveColor = color ?? 'neutral';

    const borderColor = color
        ? theme.color(color)
        : theme.isLight
            ? theme.color('grey', 300)
            : theme.color('grey', 700);
    const fillColor = variant === 'fill'
        ? theme.color(effectiveColor, 500)
        : variant === 'fill-inverse'
            ? theme.color(effectiveColor, theme.isLight ? 100 : effectiveColor === 'neutral' ? 800 : 900)
            : variant === 'fill-translucent'
                ? theme.color(effectiveColor, 500, 0.24)
                : 'none';

    if (containerWidth === 0 || containerHeight === 0) {
        return null
    }

    return (
        <Svg
            viewBox={`0 0 ${containerWidth} ${containerHeight}`}
            style={styles.bevelOutline}
        >
            <Polygon
                points={containerWidth > 0 && containerHeight > 0
                    ? `${bevel},0 ${containerWidth - bevel},0 ${containerWidth},${bevel} ${containerWidth},${containerHeight - bevel} ${containerWidth - bevel},${containerHeight} ${bevel},${containerHeight} 0,${containerHeight - bevel} 0,${bevel}`
                    : ''}
                fill={fillColor}
                stroke={borderColor}
                strokeWidth={1}
            />
        </Svg>
    );
};
