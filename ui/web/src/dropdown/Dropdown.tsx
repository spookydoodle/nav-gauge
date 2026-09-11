import { ComponentProps, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DropdownList } from "./DropdownList";
import { DropdownProps, useTheme } from "@ui";
import { Icon } from "../icons";
import { Icons } from "@ui";
import styles from './dropdown.module.css';

const ICON_SIZES: Record<string, number> = {
    xs: 12,
    sm: 16,
    md: 20,
};

interface Props {
    ariaLabel?: string;
    labelledBy?: string;
}

export function Dropdown<T = string>({
    color = 'neutral',
    highlightColor,
    size = 'sm',
    variant = 'fill-inverse',
    value,
    options,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    ariaLabel,
    labelledBy,
    className,
    style,
    ...props
}: DropdownProps<T> & Props & Omit<ComponentProps<'div'>, 'onChange'>) {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleClose = () => {
        setIsOpen(false);
        triggerRef.current?.focus();
    };

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setIsOpen(true);
        }
    };

    const handleContainerKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            handleClose();
        }
    };

    const selectedOption = options.find((option) => option.value === value);
    const iconSize = ICON_SIZES[size];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div
            ref={containerRef}
            className={classNames(
                styles['dropdown-select'],
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor || color}`],
                styles[`size-${size}`],
                styles[`variant-${variant}`],
                {
                    [styles['disabled']]: disabled,
                    [styles['open']]: isOpen,
                },
                className
            )}
            style={style}
            onKeyDown={handleContainerKeyDown}
            {...props}
        >
            <button
                ref={triggerRef}
                type="button"
                className={styles['trigger']}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
                disabled={disabled}
                onClick={disabled ? undefined : (() => setIsOpen(!isOpen))}
                onKeyDown={handleTriggerKeyDown}
            >
                {selectedOption ? (
                    <>
                        {selectedOption.icon ? (
                            <Icon
                                src={selectedOption.icon}
                                width={iconSize}
                                height={iconSize}
                                className={styles['icon']}
                            />
                        ) : null}
                        <span className={styles['label']}>{selectedOption.label}</span>
                    </>
                ) : (
                    <span className={styles['placeholder']}>{placeholder}</span>
                )}
                <Icon
                    src={Icons.NounProject.ChevronDownDoubleSquareFill}
                    width={iconSize}
                    height={iconSize}
                    className={classNames(styles['icon'], styles['arrow'], {
                        [styles['arrow-open']]: isOpen
                    })}
                />
            </button>

            {isOpen ? (
                <DropdownList
                    onClose={handleClose}
                    iconSize={iconSize}
                    color={color}
                    value={value}
                    options={options}
                    onChange={onChange}
                />
            ) : null}
        </div>
    );
}
