import { ReactNode } from 'react';
import { ColorVariant, GlowStyle, SizeVariant } from '../../model';

export type HudDecorationCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface HudDecorationProps {
    children: ReactNode;
    color?: ColorVariant;
    size?: SizeVariant;
    glowStyle?: GlowStyle;
    corners?: readonly HudDecorationCorner[];
}
