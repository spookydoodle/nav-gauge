import { FC, useState } from "react";
import { View, ViewStyle, StyleProp, Pressable } from "react-native";
import { PanelProps, SizeVariant, useTheme } from "@ui";

interface Props {
    style?: StyleProp<ViewStyle>;
}

const paddingMap: Record<SizeVariant, number> = {
    xs: 6,
    sm: 10,
    md: 14,
};

export const Panel: FC<PanelProps & Props> = ({
    color = "neutral",
    highlightColor = color,
    variant,
    glowStyle: _glowStyle,
    themeMode,
    padding,
    borderWidth = 2,
    interactive = false,
    active = false,
    style,
    children,
}) => {
    const theme = useTheme();
    const [pressed, setPressed] = useState(false);
    const hl = pressed || active;
    const effectiveTheme = themeMode || theme.mode;
    const isLight = effectiveTheme === 'light';

    const baseColor = theme.color(color, 500);
    const highlight500 = theme.color(highlightColor, 500);
    const highlightAccent = theme.color(highlightColor, isLight ? 600 : 300);

    const containerStyle: ViewStyle = (() => {
        switch (variant) {
            case 'fill': {
                let fillColor: string;
                let borderColor: string;
                if (active) {
                    fillColor = theme.color(highlightColor, 500);
                    borderColor = highlight500;
                } else if (pressed) {
                    fillColor = highlightAccent;
                    borderColor = highlightAccent;
                } else {
                    fillColor = theme.color(color, 500);
                    borderColor = baseColor;
                }
                return {
                    backgroundColor: fillColor,
                    borderColor: borderColor,
                    borderWidth,
                    padding: padding ? paddingMap[padding] : undefined,
                };
            }

            case 'fill-inverse': {
                const isNeutral = color === 'neutral';
                const bgShade = isLight ? 100 : (isNeutral ? 800 : 900);
                const hlBgShade = isLight ? 100 : 900;
                let fillColor: string;
                let borderColor: string;
                if (active) {
                    fillColor = theme.color(highlightColor, hlBgShade);
                    borderColor = highlight500;
                } else if (pressed) {
                    fillColor = theme.color(highlightColor, hlBgShade);
                    borderColor = highlightAccent;
                } else {
                    fillColor = theme.color(color, bgShade);
                    borderColor = baseColor;
                }
                return {
                    backgroundColor: fillColor,
                    borderColor: borderColor,
                    borderWidth,
                    padding: padding ? paddingMap[padding] : undefined,
                };
            }

            case 'fill-translucent': {
                const fill = hl
                    ? theme.color(highlightColor, 500, active ? 0.48 : 0.36)
                    : theme.color(color, 500, 0.24);
                const border = hl ? (active ? highlight500 : highlightAccent) : baseColor;
                return {
                    backgroundColor: fill,
                    borderColor: border,
                    borderWidth,
                    padding: padding ? paddingMap[padding] : undefined,
                };
            }

            default: {
                const isOutline = variant === 'outline';
                const isGhost = variant === 'ghost';
                let bgFill: string | undefined;
                let bColor: string;
                if (active) {
                    bgFill = theme.color(highlightColor, 500, isOutline ? 0.24 : 0.14);
                    bColor = isOutline ? highlight500 : 'transparent';
                } else if (pressed) {
                    bgFill = theme.color(highlightColor, 500, isOutline ? 0.12 : 0.10);
                    bColor = isOutline ? highlightAccent : 'transparent';
                } else {
                    bgFill = isGhost ? 'transparent' : undefined;
                    bColor = isOutline ? baseColor : 'transparent';
                }
                return {
                    backgroundColor: bgFill,
                    borderColor: bColor,
                    borderWidth: isOutline ? borderWidth : 0,
                    padding: padding ? paddingMap[padding] : undefined,
                };
            }
        }
    })();

    const container = (
        <View style={[containerStyle, style]}>
            {children}
        </View>
    );

    if (interactive) {
        return (
            <Pressable
                onPress={() => { /* external click handling via parent */ }}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
            >
                {container}
            </Pressable>
        );
    }

    return container;
};
