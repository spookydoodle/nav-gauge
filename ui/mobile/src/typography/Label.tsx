import { FC } from "react";
import { Text, TextProps } from "./Text";

export const Label: FC<TextProps> = ({ style, ...props }) => (
    <Text variant="caption" {...props} style={style} />
);