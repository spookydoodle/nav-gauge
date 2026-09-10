import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { HudDecorationCorner, HudDecorationProps, SizeVariant, useTheme } from '@ui';

const paths: Record<HudDecorationCorner, string> = {
    'top-left': 'M 1 24 V 8 H 8 V 1 H 24',
    'top-right': 'M 76 1 H 92 V 8 H 99 V 24',
    'bottom-left': 'M 1 76 V 92 H 8 V 99 H 24',
    'bottom-right': 'M 76 99 H 92 V 92 H 99 V 76',
};
const strokeWidths: Record<SizeVariant, number> = { xs: 1, sm: 1.5, md: 2 };
const offsets: Record<SizeVariant, number> = { xs: 3, sm: 5, md: 7 };
const styles = StyleSheet.create({
    wrapper: { alignSelf: 'flex-start', position: 'relative' },
    decoration: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
});

export const HudDecoration: FC<HudDecorationProps> = ({
    children,
    color = 'primary',
    size = 'sm',
    glowStyle = 'none',
    corners = ['top-left', 'bottom-right'],
}) => {
    const theme = useTheme();
    const decorationColor = theme.color(color);
    const offset = offsets[size];
    return (
        <View style={styles.wrapper}>
            {children}
            <Svg style={[styles.decoration, { top: -offset, right: -offset, bottom: -offset, left: -offset }]} viewBox="0 0 100 100" preserveAspectRatio="none" pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                {glowStyle !== 'none' ? corners.map((corner) => <Path key={`glow-${corner}`} d={paths[corner]} fill="none" stroke={decorationColor} strokeWidth={strokeWidths[size] + 6} strokeOpacity={0.18} vectorEffect="non-scaling-stroke" />) : null}
                {corners.map((corner) => <Path key={corner} d={paths[corner]} fill="none" stroke={decorationColor} strokeWidth={strokeWidths[size]} vectorEffect="non-scaling-stroke" />)}
            </Svg>
        </View>
    );
};
