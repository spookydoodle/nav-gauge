import { ComponentProps, CSSProperties, FC, useEffect, useId, useRef, useState } from 'react';
import classNames from 'classnames';
import { NotchedPanelProps, SizeVariant, useTheme } from '@ui';
import styles from './notched-panel.module.css';

const paddingMap: Record<SizeVariant, number> = { xs: 6, sm: 10, md: 16 };

interface Props {
    contentClassName?: string;
    contentStyle?: CSSProperties;
}

export const NotchedPanel: FC<NotchedPanelProps & Props & ComponentProps<'div'>> = ({
    color = 'neutral',
    highlightColor = color,
    variant = 'fill-inverse',
    padding,
    glowStyle = 'none',
    themeMode,
    header,
    children,
    className,
    style,
    contentClassName,
    contentStyle,
    ...props
}) => {
    const theme = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, headerHeight: 0 });
    const filterId = useId();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const updateDimensions = () => {
            const rectangle = container.getBoundingClientRect();
            setDimensions({
                width: rectangle.width,
                height: rectangle.height,
                headerHeight: headerRef.current?.getBoundingClientRect().height ?? 0,
            });
        };
        const observer = new ResizeObserver(updateDimensions);
        observer.observe(container);
        if (headerRef.current) observer.observe(headerRef.current);
        updateDimensions();
        return () => observer.disconnect();
    }, [header]);

    const { width, height, headerHeight } = dimensions;
    const notch = Math.min(18, width / 5, height / 4);
    const step = Math.min(10, width / 10);
    const bodyPoints = `${notch},1 ${width - notch - step},1 ${width - 1},${notch + step} ${width - 1},${height - notch} ${width - notch},${height - 1} ${width * 0.58},${height - 1} ${width * 0.54},${height - step} ${notch + step},${height - step} ${notch},${height - 1} 1,${height - notch} 1,${notch}`;
    const headerPoints = `${notch},1 ${width - notch - step},1 ${width - 1},${notch + step} ${width - notch},${headerHeight} ${width * 0.58},${headerHeight} ${width * 0.54},${Math.max(1, headerHeight - step)} ${notch + step},${Math.max(1, headerHeight - step)} 1,${Math.max(1, headerHeight - notch)}`;
    const ready = width > 0 && height > 0;

    return (
        <div
            ref={containerRef}
            className={classNames(styles.panel, styles[`color-${color}`], styles[`highlight-color-${highlightColor}`], styles[`variant-${variant}`], styles[`mode-${themeMode ?? theme.mode}`], styles[`glow-style-${glowStyle}`], className)}
            style={{ ...style, '--notched-filter': `url(#${filterId})` } as CSSProperties}
            {...props}
        >
            {ready ? (
                <svg className={styles.svg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
                    <defs><filter id={filterId} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" /></filter></defs>
                    <polygon className={styles.body} points={bodyPoints} vectorEffect="non-scaling-stroke" />
                    <polyline className={styles.step} points={`${notch + 7},${height - 6} ${width * 0.38},${height - 6} ${width * 0.42},${height - 2}`} vectorEffect="non-scaling-stroke" />
                    {header ? <polygon className={styles.header} points={headerPoints} vectorEffect="non-scaling-stroke" /> : null}
                    {glowStyle !== 'none' ? <polygon className={styles.glow} points={bodyPoints} vectorEffect="non-scaling-stroke" /> : null}
                </svg>
            ) : null}
            {header ? <div ref={headerRef} className={styles['header-content']}>{header}</div> : null}
            <div className={classNames(styles.content, contentClassName)} style={{ ...contentStyle, padding: padding ? paddingMap[padding] : 0 }}>{children}</div>
        </div>
    );
};
