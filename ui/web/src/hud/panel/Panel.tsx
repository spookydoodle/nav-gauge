import { ComponentProps, CSSProperties, FC, RefObject } from "react";
import { PanelProps, useTheme } from "@ui";
import classNames from "classnames";
import styles from "./panel.module.css";

interface Props {
    forwardRef?: RefObject<HTMLDivElement | null>;
    className?: string;
    style?: CSSProperties;
}

export const Panel: FC<PanelProps & Props & ComponentProps<'div'>> = ({
    shape,
    interactive = false,
    glowStyle = "none",
    color = 'neutral',
    highlightColor,
    variant,
    padding,
    borderWidth = 2,
    themeMode,
    active = false,
    onClick,
    forwardRef,
    className,
    style = {},
    children,
    ...props
}) => {
    const theme = useTheme();
    const effectiveMode = themeMode ?? theme.mode;

    return (
        <div
            ref={forwardRef}
            onClick={onClick}
            className={classNames(
                styles.panel,
                variant && styles[`variant-${variant}`],
                color && styles[`color-${color}`],
                styles[`highlight-color-${highlightColor || color}`],
                styles[`mode-${effectiveMode}`],
                {
                    [styles[shape ?? '']]: !!shape,
                    [styles[`padding-${padding}`]]: !!padding,
                    [styles['active']]: active,
                    [styles['interactive']]: interactive || onClick,
                    [styles[`glow-style-${glowStyle}`]]: interactive,
                },
                className
            )}
            style={{
                '--border-width': `${borderWidth}px`,
                ...style
            } as CSSProperties}
            {...props}
        >
            {children}
        </div>
    );
};
