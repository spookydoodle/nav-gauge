import { ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../../model";

export interface FieldsetProps {
    label: string;
    prepend?: ReactNode;
    append?: ReactNode;
    size?: SizeVariant;
    color?: ColorVariant;
    variant?: SurfaceFillVariant;
    /**
     * Defaults to true
     */
    expandable?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    children?: ReactNode;
}
