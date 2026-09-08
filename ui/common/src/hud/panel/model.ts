import { ReactNode } from "react";
import { ColorVariant, GlowStyle, SizeVariant, SurfaceFillVariant } from "../../model";
import { ThemeMode } from "../../theme";

export type PanelShape = 'default';

export interface PanelProps {
    shape?: PanelShape;
    interactive?: boolean;
    glowStyle?: GlowStyle;
    color?: ColorVariant;
    padding?: SizeVariant;
    highlightColor?: ColorVariant;
    variant?: SurfaceFillVariant;
    /**
     * Defaults to 2
     */
    borderWidth?: number;
    themeMode?: ThemeMode;
    active?: boolean;
    children?: ReactNode;
}
