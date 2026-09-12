import { FC, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { getVisibleTabIndexes, Icons, TabstripProps, useTheme } from '@ui';
import { Button } from '../../button';
import { Menu, MenuItem } from '../../menu';
import styles from './tabstrip.module.css';

export const Tabstrip: FC<TabstripProps> = ({
    options,
    value,
    onChange,
    size = 'sm',
    color = 'neutral',
    highlightColor = color,
    variant = 'fill-inverse',
    spread = false,
    overflowAccessibilityLabel,
    children,
}) => {
    const theme = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const measurementRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const previousContentRef = useRef<{ children: ReactNode; value: string }>({ children, value });
    const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
    const [contentHeight, setContentHeight] = useState<number>();
    const [outgoingContent, setOutgoingContent] = useState<{ children: ReactNode; value: string }>();

    useLayoutEffect(() => {
        const previousContent = previousContentRef.current;
        if (previousContent.value === value) return;

        setOutgoingContent(previousContent);
        const timeout = window.setTimeout(() => setOutgoingContent(undefined), 200);
        return () => window.clearTimeout(timeout);
    }, [value]);

    useLayoutEffect(() => {
        previousContentRef.current = { children, value };
    });

    useEffect(() => {
        const container = containerRef.current;
        const measurement = measurementRef.current;
        if (!container || !measurement) return;

        const updateVisibleCount = () => {
            const widths = Array.from(measurement.children, (child) => child.getBoundingClientRect().width);
            const overflowWidth = widths.pop() ?? 0;
            const availableWidth = container.getBoundingClientRect().width;
            setVisibleIndexes(getVisibleTabIndexes(widths, availableWidth, overflowWidth, options.findIndex((option) => option.value === value)));
        };

        const observer = new ResizeObserver(updateVisibleCount);
        observer.observe(container);
        observer.observe(measurement);
        updateVisibleCount();
        return () => observer.disconnect();
    }, [options, size, value]);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;

        const observer = new ResizeObserver(() => setContentHeight(content.getBoundingClientRect().height));
        observer.observe(content);
        setContentHeight(content.getBoundingClientRect().height);
        return () => observer.disconnect();
    }, [children]);

    const visibleOptions = visibleIndexes.map((index) => options[index]);
    const visibleIndexSet = new Set(visibleIndexes);
    const overflowOptions = options.filter((_, index) => !visibleIndexSet.has(index));
    const buttonProps = { color, highlightColor, size, variant };

    return (
        <div className={classNames(styles['root'], styles[`color-${color}`], styles[`highlight-${highlightColor}`], styles[`mode-${theme.mode}`])}>
            <div ref={containerRef} className={classNames(styles['header'], { [styles['spread']]: spread })} role="tablist">
                {visibleOptions.map((option, visibleIndex) => (
                    <Button
                        key={option.value}
                        {...buttonProps}
                        className={classNames(styles['tab'], styles[`variant-${variant}`], {
                            [styles['first']]: visibleIndex === 0,
                            [styles['trailing']]: visibleIndex === visibleOptions.length - 1 && overflowOptions.length === 0,
                            [styles['last']]: spread && visibleIndex === visibleOptions.length - 1 && overflowOptions.length === 0,
                        })}
                        role="tab"
                        aria-selected={option.value === value}
                        active={option.value === value}
                        disabled={option.disabled}
                        onClick={() => onChange(option.value)}
                    >
                        <span className={styles['label']}>{option.label}</span>
                    </Button>
                ))}
                {overflowOptions.length ? (
                    <Menu
                        {...buttonProps}
                        icon={Icons.NounProject.KebabMenu}
                        iconActiveColor={highlightColor}
                        triggerAccessibilityLabel={overflowAccessibilityLabel}
                        triggerActive={overflowOptions.some((option) => option.value === value)}
                        className={styles['overflow']}
                    >
                        {overflowOptions.map((option) => (
                            <MenuItem key={option.value} type="button" disabled={option.disabled} closeOnPress onClick={() => onChange(option.value)}>
                                {option.value === value ? '* ' : null}{option.label}
                            </MenuItem>
                        ))}
                    </Menu>
                ) : null}
                <div ref={measurementRef} className={styles['measurement']} aria-hidden="true">
                    {options.map((option) => (
                        <Button key={option.value} {...buttonProps} className={styles['tab']} tabIndex={-1}>{option.label}</Button>
                    ))}
                    <Button {...buttonProps} className={styles['overflow']} icon={Icons.NounProject.KebabMenu} tabIndex={-1} />
                </div>
            </div>
            {children !== undefined && children !== null ? (
                <div className={styles['content']} style={{ height: contentHeight }}>
                    {outgoingContent?.children !== undefined && outgoingContent.children !== null ? (
                        <div key={outgoingContent.value} className={classNames(styles['content-inner'], styles['content-outgoing'], styles[`size-${size}`], styles[`content-${variant}`])} aria-hidden="true">
                            {outgoingContent.children}
                        </div>
                    ) : null}
                    <div key={value} ref={contentRef} className={classNames(styles['content-inner'], styles[`size-${size}`], styles[`content-${variant}`])}>{children}</div>
                </div>
            ) : null}
        </div>
    );
};
