import { ChangeEvent, ComponentProps, FC, useId } from "react";
import classNames from "classnames";
import { RadioProps, useTheme } from "@ui";
import styles from './radio.module.css';

interface Props {
    labelledBy?: string;
}

export const Radio: FC<Omit<ComponentProps<'label'>, 'onChange'> & RadioProps & Props> = ({
    id,
    labelledBy,
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
    checked,
    onChange,
    disabled = false,
    children,
    className,
    style,
    ...props
}) => {
    const generatedId = useId();
    const effectiveId = id || generatedId;
    const theme = useTheme();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === 'Enter' && !disabled) {
            e.preventDefault();
            onChange(!checked);
        }
    };

    return (
        <label
            onKeyDown={handleKeyDown}
            aria-labelledby={labelledBy}
            htmlFor={effectiveId}
            className={classNames(
                styles['radio'],
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor}`],
                styles[`size-${size}`],
                {
                    [styles['disabled']]: disabled,
                    [styles['checked']]: checked,
                },
                className
            )}
            style={style}
            {...props}
        >
            <input
                id={effectiveId}
                type="radio"
                className={styles['input']}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
            />
            <span className={classNames(styles['box'], { [styles['box-checked']]: checked })}>
                {checked ? <span className={styles['dot']} /> : null}
            </span>
            {children ? (
                <span className={styles['label']}>
                    {children}
                </span>
            ) : null}
        </label>
    );
};