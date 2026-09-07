import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../model";

export interface RadioProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    disabled?: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}