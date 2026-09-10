import { PanelProps } from '../hud';
import { MenuAnchor } from '../menu';
import { ReactNode } from 'react';

export interface PopupProps {
    anchor?: React.RefObject<HTMLElement | null>;
    position?: { x: number; y: number };
    variant?: PanelProps['variant'];
    shape?: PanelProps['shape'];
    /** Which corner of the trigger supplies the popup's attachment point. */
    triggerAnchor?: MenuAnchor;
    /** Which popup corner attaches there. Placement may flip to stay inside the viewport. */
    popupAnchor?: MenuAnchor;
    dismissOnClickAway?: boolean;
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
}
