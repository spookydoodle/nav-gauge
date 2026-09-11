import { FC } from "react";
import { StyleSheet } from "react-native";
import { LabelProps } from "@ui";
import { Text, TextProps } from "./Text";

export const Label: FC<TextProps & LabelProps> = ({ disabled = false, style, ...props }) => (
    <Text variant="caption" {...props} color={disabled ? 'neutral' : props.color} style={[disabled && styles.disabled, style]} />
);

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.4,
    },
});
