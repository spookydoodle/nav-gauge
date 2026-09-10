import { ReactNode } from 'react';
import { ColorVariant, GlowStyle, SizeVariant, SurfaceFillVariant } from '../../model';
import { ThemeMode } from '../../theme';

export interface NotchedPanelProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    variant?: SurfaceFillVariant;
    padding?: SizeVariant;
    glowStyle?: GlowStyle;
    themeMode?: ThemeMode;
    header?: ReactNode;
    children?: ReactNode;
}
