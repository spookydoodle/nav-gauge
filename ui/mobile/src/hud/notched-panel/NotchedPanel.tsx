import { FC, useState } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import Svg, { Polygon, Polyline } from 'react-native-svg';
import { ColorVariant, NotchedPanelProps, SizeVariant, useTheme } from '@ui';

const paddingMap: Record<SizeVariant, number> = { xs: 6, sm: 10, md: 16 };

interface Props extends Omit<ViewProps, 'children' | 'onLayout' | 'style'> {
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
    panel: { position: 'relative', minWidth: 80 },
    header: { minHeight: 38, paddingTop: 9, paddingRight: 32, paddingBottom: 11, paddingLeft: 18 },
    content: { marginHorizontal: 18, marginBottom: 10 },
});

export const NotchedPanel: FC<NotchedPanelProps & Props> = ({
    color: colorProp = 'neutral',
    highlightColor: highlightColorProp,
    variant = 'fill-inverse',
    padding,
    glowStyle = 'none',
    themeMode,
    header,
    children,
    style,
    contentStyle,
    ...props
}) => {
    const theme = useTheme();
    const color = colorProp as ColorVariant;
    const highlightColor = (highlightColorProp ?? color) as ColorVariant;
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, headerHeight: 0 });
    const effectiveMode = themeMode ?? theme.mode;
    const baseColor = theme.color(color, 500);
    const highlight = theme.color(highlightColor, 500);
    const inverseShade = effectiveMode === 'light' ? 100 : color === 'neutral' ? 800 : 900;
    const fill = variant === 'fill'
        ? baseColor
        : variant === 'fill-translucent'
            ? theme.color(color, 500, 0.24)
            : theme.color(color, inverseShade);
    const { width, height, headerHeight } = dimensions;
    const notch = Math.min(18, width / 5, height / 4);
    const step = Math.min(10, width / 10);
    const bodyPoints = `${notch},1 ${width - notch - step},1 ${width - 1},${notch + step} ${width - 1},${height - notch} ${width - notch},${height - 1} ${width * 0.58},${height - 1} ${width * 0.54},${height - step} ${notch + step},${height - step} ${notch},${height - 1} 1,${height - notch} 1,${notch}`;
    const headerPoints = `${notch},1 ${width - notch - step},1 ${width - 1},${notch + step} ${width - notch},${headerHeight} ${width * 0.58},${headerHeight} ${width * 0.54},${Math.max(1, headerHeight - step)} ${notch + step},${Math.max(1, headerHeight - step)} 1,${Math.max(1, headerHeight - notch)}`;
    const ready = width > 0 && height > 0;

    const onLayout = (event: LayoutChangeEvent) => {
        const { width: nextWidth, height: nextHeight } = event.nativeEvent.layout;
        setDimensions((current) => ({ ...current, width: nextWidth, height: nextHeight }));
    };

    return (
        <View {...props} onLayout={onLayout} style={[styles.panel, style]}>
            {ready ? (
                <Svg viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill} pointerEvents="none" accessibilityElementsHidden>
                    {glowStyle !== 'none' ? <Polygon points={bodyPoints} fill="none" stroke={highlight} strokeWidth={glowStyle === 'glow' ? 10 : 6} strokeOpacity={0.18} /> : null}
                    <Polygon points={bodyPoints} fill={fill} stroke={baseColor} strokeWidth={variant === 'fill' ? 0 : 2} />
                    <Polyline points={`${notch + 7},${height - 6} ${width * 0.38},${height - 6} ${width * 0.42},${height - 2}`} fill="none" stroke={highlight} strokeWidth={2} />
                    {header ? <Polygon points={headerPoints} fill={highlight} stroke={highlight} strokeWidth={2} /> : null}
                </Svg>
            ) : null}
            {header ? (
                <View onLayout={(event) => setDimensions((current) => ({ ...current, headerHeight: event.nativeEvent.layout.height }))} style={styles.header}>
                    {header}
                </View>
            ) : null}
            <View style={[styles.content, padding ? { padding: paddingMap[padding] } : null, contentStyle]}>{children}</View>
        </View>
    );
};
