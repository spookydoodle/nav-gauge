import { ReactNode } from 'react';
import { ColorVariant, SizeVariant, SurfaceVariant } from '../../model';

export type TabstripVariant = Extract<SurfaceVariant, 'fill-inverse' | 'fill-translucent' | 'outline'>;

export interface TabstripOption {
    value: string;
    label: ReactNode;
    disabled?: boolean;
}

export interface TabstripProps {
    children?: ReactNode;
    options: readonly TabstripOption[];
    value: string;
    onChange: (value: string) => void;
    size?: SizeVariant;
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    variant?: TabstripVariant;
    spread?: boolean;
    overflowAccessibilityLabel: string;
}
