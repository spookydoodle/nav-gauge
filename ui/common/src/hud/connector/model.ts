import { ReactNode } from 'react';
import { ColorVariant, GlowStyle } from '../../model';

export type HudConnectorAnchor =
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'right'
    | 'bottom-right'
    | 'bottom'
    | 'bottom-left'
    | 'left'
    | 'center';

export interface HudConnectorProps {
    children: ReactNode;
    color?: ColorVariant;
    glowStyle?: GlowStyle;
    fromAnchor?: HudConnectorAnchor;
    toAnchor?: HudConnectorAnchor;
}
