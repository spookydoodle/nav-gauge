import { useState, useRef, useEffect, FC, CSSProperties, ComponentProps } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
    MenuPosition,
    getIconAndMenuAnchors,
    MenuContext,
    getIconAnchorPoint,
    menuPositionsMatch,
    placePopup,
    MenuProps,
    Icons,
    useTheme,
} from '@ui';
import { Button } from '../button';
import { Transition } from '../transition';
import styles from './menu.module.css';

interface Props extends MenuProps {
    menuListClassName?: string;
}

export const Menu: FC<Props & ComponentProps<'button'>> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    iconSize,
    placement = 'bottom-right',
    tooltip,
    tooltipPlacement,
    color = 'neutral',
    triggerAccessibilityLabel,
    triggerActive = false,
    menuListClassName,
    children,
    ...props
}) => {
    const { icon: iconAnchor, menu: menuAnchor } = getIconAndMenuAnchors(placement);
    const theme = useTheme();
    const [visible, setVisible] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});
    const triggerRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setVisible((current) => !current);
    };

    const handleClose = () => setVisible(false);

    useEffect(() => {
        if (!visible) {
            return;
        }

        const computePosition = () => {
            const triggerBounds = triggerRef.current?.getBoundingClientRect();
            if (!triggerBounds) {
                return;
            }

            const menuBounds = containerRef.current?.getBoundingClientRect();
            const triggerPoint = getIconAnchorPoint(
                iconAnchor,
                triggerBounds.left,
                triggerBounds.top,
                triggerBounds.width,
                triggerBounds.height,
            );
            const nextPosition = placePopup(
                menuAnchor,
                triggerPoint,
                menuBounds ? { width: menuBounds.width, height: menuBounds.height } : null,
                window.innerWidth,
                window.innerHeight,
            ).position;

            setMenuPosition((current) => menuPositionsMatch(current, nextPosition) ? current : nextPosition);
        };

        computePosition();
        let animationFrame = 0;
        const followTrigger = () => {
            computePosition();
            animationFrame = requestAnimationFrame(followTrigger);
        };
        animationFrame = requestAnimationFrame(followTrigger);

        return () => cancelAnimationFrame(animationFrame);
    }, [visible, iconAnchor, menuAnchor]);

    useEffect(() => {
        if (!visible) {
            return;
        }
        const mousedownHandler = (e: MouseEvent) => {
            if (triggerRef.current && !triggerRef.current?.contains(e.target as Node) && !containerRef.current?.contains(e.target as Node)) {
                handleClose();
            }
        };
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('mousedown', mousedownHandler);
        document.addEventListener('keydown', keydownHandler);

        return () => {
            document.removeEventListener('mousedown', mousedownHandler);
            document.removeEventListener('keydown', keydownHandler);
        };
    }, [visible]);

    useEffect(() => {
        if (visible && containerRef.current) {
            const firstItem = containerRef.current.querySelector<HTMLElement>('[role="menuitem"]');
            firstItem?.focus();
        }
    }, [visible]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const items = containerRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
        if (!items || items.length === 0) return;

        const currentIndex = Array.from(items).findIndex((item) => item === document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                {
                    const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                    items[next]?.focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                {
                    const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                    items[prev]?.focus();
                }
                break;
            case 'Home':
                e.preventDefault();
                items[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                items[items.length - 1]?.focus();
                break;
        }
    };

    const positionStyle: CSSProperties = {};

    if (menuPosition.top !== undefined) positionStyle.top = menuPosition.top;
    if (menuPosition.left !== undefined) positionStyle.left = menuPosition.left;
    if (menuPosition.right !== undefined) positionStyle.right = menuPosition.right;
    if (menuPosition.bottom !== undefined) positionStyle.bottom = menuPosition.bottom;

    return (
        <>
            <Button
                ref={triggerRef}
                variant="ghost"
                icon={icon}
                size={iconSize}
                active={visible || triggerActive}
                color={color}
                highlightColor={iconActiveColor}
                onClick={handleToggle}
                tooltip={tooltip}
                tooltipPlacement={tooltipPlacement}
                aria-label={triggerAccessibilityLabel}
                {...props}
            />
            {visible && createPortal(
                <div
                    ref={containerRef}
                    className={classNames(
                        styles['menu-list'],
                        styles[`mode-${theme.mode}`],
                        styles[`color-${color}`],
                        styles[`highlight-${iconActiveColor || color}`],
                        menuListClassName,
                    )}
                    style={positionStyle}
                    role="menu"
                    aria-orientation="vertical"
                    onKeyDown={handleKeyDown}
                >
                    <MenuContext.Provider value={{ onClose: handleClose, triggerRef }}>
                        <Transition slide={menuPosition.bottom ? "to-top" : "to-bottom"} render>
                            {children}
                        </Transition>
                    </MenuContext.Provider>
                </div>,
                document.body,
            )}
        </>
    );
};
