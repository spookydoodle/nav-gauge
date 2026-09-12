import { useEffect, useRef, useState, CSSProperties, FC } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { MenuPosition, getIconAnchorPoint, menuPositionsMatch, placePopup, PopupProps } from '@ui';
import { Transition } from '../transition';
import type { TransitionProps } from '@ui';
import styles from './popup.module.css';
import { Panel } from '../hud';

let popupCounter = 0;
const openPopups: number[] = [];

interface Props extends PopupProps {
    overlayClassName?: string;
    popupClassName?: string;
}

export const Popup: FC<Props> = ({
    anchor,
    position,
    triggerAnchor = 'top-left',
    popupAnchor = 'bottom-left',
    dismissOnClickAway = true,
    variant,
    shape,
    visible,
    onClose,
    overlayClassName,
    popupClassName,
    children,
    ...props
}) => {
    const [popupOrder] = useState(() => ++popupCounter);
    const containerRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});

    useEffect(() => {
        if (!visible) {
            return;
        }
        openPopups.push(popupOrder);

        return () => {
            const index = openPopups.indexOf(popupOrder);
            if (index !== -1) {
                openPopups.splice(index, 1);
            }
        };
    }, [visible, popupOrder]);

    useEffect(() => {
        if (!visible) {
            return;
        }

        const computePosition = () => {
            let iconAnchor: { x: number; y: number };

            if (anchor && anchor.current) {
                const rect = anchor.current.getBoundingClientRect();
                iconAnchor = getIconAnchorPoint(triggerAnchor, rect.left, rect.top, rect.width, rect.height);
            } else if (position) {
                iconAnchor = position;
            } else {
                return;
            }

            const rect = containerRef.current?.getBoundingClientRect();
            const size = rect ? { width: rect.width, height: rect.height } : null;

            const nextPosition = placePopup(
                popupAnchor,
                iconAnchor,
                size,
                window.innerWidth,
                window.innerHeight,
            ).position;

            setMenuPosition((current) => menuPositionsMatch(current, nextPosition) ? current : nextPosition);
        };

        computePosition();
        let animationFrame = 0;
        const tick = () => {
            computePosition();
            animationFrame = requestAnimationFrame(tick);
        };
        animationFrame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationFrame);
    }, [visible, anchor, position, triggerAnchor, popupAnchor]);

    useEffect(() => {
        if (!visible) {
            return;
        }
        const isTopmost = () => openPopups.length > 0 && Math.max(...openPopups) === popupOrder;
        const isOwnedPortalTarget = (target: EventTarget | null) => {
            const portalTriggerId = target instanceof Element
                ? target.closest<HTMLElement>('[data-popup-trigger-id]')?.dataset.popupTriggerId
                : undefined;
            const portalTrigger = portalTriggerId ? document.getElementById(portalTriggerId) : null;
            return Boolean(portalTrigger && containerRef.current?.contains(portalTrigger));
        };
        const mousedownHandler = (e: MouseEvent) => {
            if (!isTopmost() || !dismissOnClickAway) {
                return;
            }
            if (
                !containerRef.current?.contains(e.target as Node) &&
                !(anchor && anchor.current?.contains(e.target as Node)) &&
                !isOwnedPortalTarget(e.target)
            ) {
                onClose();
            }
        };
        const keydownHandler = (e: KeyboardEvent) => {
            if (isTopmost() && e.key === 'Escape' && !isOwnedPortalTarget(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', mousedownHandler);
        document.addEventListener('keydown', keydownHandler);

        return () => {
            document.removeEventListener('mousedown', mousedownHandler);
            document.removeEventListener('keydown', keydownHandler);
        };
    }, [visible, onClose, anchor, dismissOnClickAway]);

    if (!visible) {
        return null;
    }

    const positionStyle: CSSProperties = {};
    if (menuPosition.top !== undefined) positionStyle.top = menuPosition.top;
    if (menuPosition.left !== undefined) positionStyle.left = menuPosition.left;
    if (menuPosition.right !== undefined) positionStyle.right = menuPosition.right;
    if (menuPosition.bottom !== undefined) positionStyle.bottom = menuPosition.bottom;

    const slide: TransitionProps['slide'] = popupAnchor.startsWith('top') ? 'to-bottom' : 'to-top';

    return createPortal(
        <div className={classNames(styles.overlay, overlayClassName)}>
            <Transition slide={slide} render={visible} onUnmount={onClose}>
                <Panel
                    forwardRef={containerRef}
                    variant={variant}
                    shape={shape}
                    className={classNames(styles.popup, popupClassName)}
                    style={positionStyle}
                    {...props}
                >
                    {children}
                </Panel>
            </Transition>
        </div>,
        document.body,
    );
};
