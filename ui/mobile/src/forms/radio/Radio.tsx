import { FC } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { RadioProps, useTheme } from "@ui";
import { Text } from "../../typography";

export const Radio: FC<RadioProps> = ({
    color = 'primary',
    highlightColor = color,
    size = 'sm',
    checked,
    onChange,
    disabled = false,
    children,
}) => {
    const theme = useTheme();

    const accentColor = theme.isLight
        ? theme.color(highlightColor, 600)
        : theme.color(highlightColor, 300);
    const baseColor = theme.color(color);

    const boxWidthHeight = size === 'md' ? 16 : size === 'sm' ? 14 : 12;
    const dotSize = boxWidthHeight / 2;
    const fontSize = size === 'xs' ? 11 : size === 'sm' ? 12 : 14;

    const containerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        opacity: disabled ? 0.4 : 1,
    };

    return (
        <Pressable
            disabled={disabled}
            onPress={() => onChange(!checked)}
            style={containerStyle}
        >
            {({ pressed }) => {
                const ringColor = pressed ? accentColor : baseColor;

                const boxStyle: ViewStyle = {
                    width: boxWidthHeight,
                    height: boxWidthHeight,
                    borderRadius: boxWidthHeight / 2,
                    borderWidth: 1,
                    borderColor: checked ? accentColor : ringColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                };

                return (
                    <>
                        <View style={boxStyle}>
                            {checked ? (
                                <View
                                    style={{
                                        width: dotSize,
                                        height: dotSize,
                                        borderRadius: dotSize / 2,
                                        backgroundColor: theme.color(highlightColor, 600),
                                    }}
                                />
                            ) : null}
                        </View>
                        {children ? (
                            <Text
                                style={{
                                    color: baseColor,
                                    fontSize,
                                    lineHeight: fontSize * 1.1,
                                }}
                            >
                                {children}
                            </Text>
                        ) : null}
                    </>
                );
            }}
        </Pressable>
    );
};