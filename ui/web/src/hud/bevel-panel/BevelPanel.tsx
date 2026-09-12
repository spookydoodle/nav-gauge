import { ComponentProps, CSSProperties, FC, useId, useEffect, useRef, useState } from "react";
import { BevelPanelProps, SizeVariant, useTheme } from "@ui";
import classNames from "classnames";
import styles from "./bevel-panel.module.css";

interface Props {
    className?: string;
    style?: CSSProperties;
    contentClassName?: string;
    contentStyle?: CSSProperties;
}

const paddingVertical: Record<SizeVariant, number> = {
    xs: 5,
    sm: 10,
    md: 15,
};

export const BevelPanel: FC<BevelPanelProps & Props & ComponentProps<'div'>> = ({
    bevel = 20,
    interactive = false,
    glowStyle = "none",
    color = 'neutral',
    highlightColor,
    variant,
    padding,
    themeMode,
    active = false,
    onClick,
    className,
    style,
    contentClassName,
    contentStyle,
    children,
    ...props
}) => {
    const theme = useTheme();
    const effectiveMode = themeMode ?? theme.mode;
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const filterId = useId();
    const clipPathId = useId();

    useEffect(() => {
        const el = containerRef.current;
        if (!el) {
            return;
        }

        const updateSize = () => {
            const rect = el.getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        };

        updateSize();

        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, []);

    const hasBorder = variant !== 'fill';

    const effectiveBevel = size.width > 0
        ? Math.min(bevel, size.width / 2 - 1)
        : bevel;

    const points = size.width > 0 && size.height > 0
        ? `${effectiveBevel},0 ${size.width - effectiveBevel},0 ${size.width},${size.height / 2} ${size.width - effectiveBevel},${size.height} ${effectiveBevel},${size.height} 0,${size.height / 2}`
        : "";

    const viewBox = `0 0 ${size.width} ${size.height}`;

    return (
        <div
            ref={containerRef}
            onClick={onClick}
            className={classNames(
                styles['bevel-panel'],
                variant && styles[`variant-${variant}`],
                color && styles[`color-${color}`],
                styles[`highlight-color-${highlightColor || color}`],
                styles[`mode-${effectiveMode}`],
                {
                    [styles['active']]: active,
                    [styles['interactive']]: interactive || onClick,
                    [styles[`glow-style-${glowStyle}`]]: interactive,
                },
                className
            )}
            style={{
                ...style,
                "--bevel-filter": `url(#${filterId})`,
            } as CSSProperties}
            {...props}
        >
            {size.width > 0 && size.height > 0 && (
                <svg
                    viewBox={viewBox}
                    className={styles.svg}
                >
                    <defs>
                        <clipPath id={clipPathId}>
                            <polygon points={points} />
                        </clipPath>
                        <filter
                            id={filterId}
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                        >
                            <feGaussianBlur
                                in="SourceGraphic"
                                stdDeviation="2"
                                result="blur1"
                            />
                            <feGaussianBlur
                                in="SourceGraphic"
                                stdDeviation="6"
                                result="blur2"
                            />
                            <feMerge>
                                <feMergeNode in="blur2" />
                                <feMergeNode in="blur1" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <polygon
                        points={points}
                        fill="none"
                        strokeWidth={hasBorder ? 2 : 0}
                        className={styles['polygon-base']}
                    />
                    <polygon
                        points={points}
                        fill="none"
                        strokeWidth={2}
                        className={styles['polygon-glow']}
                    />
                </svg>
            )}
            <div
                className={classNames(styles.content, contentClassName)}
                style={{
                    ...contentStyle,
                    clipPath: size.width > 0 ? `url(#${clipPathId})` : undefined,
                    paddingTop: padding ? paddingVertical[padding] : 0,
                    paddingBottom: padding ? paddingVertical[padding] : 0,
                    paddingLeft: effectiveBevel,
                    paddingRight: effectiveBevel,
                } as CSSProperties}
            >
                {children}
            </div>
        </div>
    );
};
