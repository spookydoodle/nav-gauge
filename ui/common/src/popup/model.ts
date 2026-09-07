import { PanelProps } from '../hud';
import { MenuAnchor } from '../menu';
import { ReactNode } from 'react';

export interface PopupProps {
    anchor?: React.RefObject<HTMLElement | null>;
    position?: { x: number; y: number };
    variant?: PanelProps['variant'];
    shape?: PanelProps['shape'];
    /** Which corner of the trigger the popup attaches to. */
    triggerAnchor?: MenuAnchor;
    /** Which corner of the popup sits at the trigger's anchor corner. */
    popupAnchor?: MenuAnchor;
    dismissOnClickAway?: boolean;
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
}
