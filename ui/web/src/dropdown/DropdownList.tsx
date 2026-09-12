import classNames from "classnames";
import { CSSProperties, RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DropdownOption, DropdownProps, getIconAnchorPoint, menuPositionsMatch, MenuPosition, placePopup, useTheme } from "@ui";
import { Icon } from "../icons";
import { Span } from "../typography";
import styles from './dropdown.module.css';

interface Props {
    id: string;
    iconSize: number;
    onClose: (restoreFocus?: boolean) => void;
    triggerRef: RefObject<HTMLButtonElement | null>;
}

export function DropdownList<T = string>({
    onClose,
    id,
    triggerRef,
    color,
    iconSize,
    value,
    options,
    onChange,
    size = 'sm',
    variant = 'fill-inverse',
    highlightColor,
}: Props & Pick<DropdownProps<T>, 'value' | 'options' | 'color' | 'highlightColor' | 'size' | 'variant' | 'onChange'>) {
    const theme = useTheme();
    const listRef = useRef<HTMLUListElement>(null);
    const hasFocusedRef = useRef(false);
    const [position, setPosition] = useState<MenuPosition>({});
    const [width, setWidth] = useState(0);
    const [highlightedIndex, setHighlightedIndex] = useState(() => {
        const idx = options.findIndex((o) => o.value === value);
        return idx >= 0 ? idx : 0;
    });

    useEffect(() => {
        const computePosition = () => {
            const triggerBounds = triggerRef.current?.getBoundingClientRect();
            if (!triggerBounds) return;

            const listBounds = listRef.current?.getBoundingClientRect();
            const nextPosition = placePopup(
                'top-left',
                getIconAnchorPoint('bottom-left', triggerBounds.left, triggerBounds.top, triggerBounds.width, triggerBounds.height),
                listBounds ? { width: triggerBounds.width, height: listBounds.height } : null,
                window.innerWidth,
                window.innerHeight,
            ).position;
            setWidth(triggerBounds.width);
            setPosition((current) => menuPositionsMatch(current, nextPosition) ? current : nextPosition);
        };

        computePosition();
        let animationFrame = requestAnimationFrame(function followTrigger() {
            computePosition();
            animationFrame = requestAnimationFrame(followTrigger);
        });
        return () => cancelAnimationFrame(animationFrame);
    }, [triggerRef]);

    useEffect(() => {
        if (!hasFocusedRef.current && Object.keys(position).length > 0) {
            hasFocusedRef.current = true;
            listRef.current?.focus();
        }
    }, [position]);

    const handleSelect = (option: DropdownOption<T>) => {
        onChange?.(option.value);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case 'Home':
                e.preventDefault();
                setHighlightedIndex(0);
                break;
            case 'End':
                e.preventDefault();
                setHighlightedIndex(options.length - 1);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (options[highlightedIndex]) {
                    handleSelect(options[highlightedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
            case 'Tab':
                onClose(false);
                break;
        }
    };

    const positionStyle: CSSProperties = { width, visibility: width ? 'visible' : 'hidden' };
    if (position.top !== undefined) positionStyle.top = position.top;
    if (position.left !== undefined) positionStyle.left = position.left;
    if (position.right !== undefined) positionStyle.right = position.right;
    if (position.bottom !== undefined) positionStyle.bottom = position.bottom;

    return createPortal(
        <ul
            id={id}
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            className={classNames(styles['menu'], styles[`mode-${theme.mode}`], styles[`color-${color ?? 'neutral'}`], styles[`highlight-${highlightColor ?? color ?? 'neutral'}`], styles[`size-${size}`], styles[`variant-${variant}`])}
            style={positionStyle}
            data-popup-trigger-id={triggerRef.current?.id || undefined}
            onKeyDown={handleKeyDown}
            aria-activedescendant={`${id}-option-${highlightedIndex}`}
        >
            {options.map((option, index) => (
                <li
                    key={String(option.value)}
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={option.value === value}
                    className={classNames(
                        styles['option'],
                        {
                            [styles['option-selected']]: option.value === value,
                            [styles['option-highlighted']]: index === highlightedIndex,
                        }
                    )}
                    onClick={() => { handleSelect(option); }}
                >
                    {option.icon ? (
                        <Icon
                            src={option.icon}
                            width={iconSize}
                            height={iconSize}
                            className={styles['icon']}
                        />
                    ) : null}
                    <Span color={color}>
                        {option.label}
                    </Span>
                </li>
            ))}
        </ul>,
        document.body,
    );
}
