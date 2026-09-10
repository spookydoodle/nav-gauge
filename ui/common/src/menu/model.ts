import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../model";
import { TooltipProps } from "../tooltip";

export type MenuAnchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface MenuPosition {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export interface MenuProps {
    color?: ColorVariant;
    /** Where the menu opens relative to its trigger. Placement may flip to stay inside the viewport. */
    placement?: MenuAnchor;
    icon?: string;
    iconSize?: SizeVariant;
    iconActiveColor?: ColorVariant;
    triggerActive?: boolean;
    tooltip?: ReactNode;
    tooltipPlacement?: TooltipProps['placement'];
    triggerAccessibilityLabel?: string;
    children?: ReactNode;
}

export interface MenuItemProps {
    key: string | number;
    highlightColor?: ColorVariant;
    isFirst?: boolean;
    closeOnPress?: boolean;
    disabled?: boolean;
    children: ReactNode;
}
