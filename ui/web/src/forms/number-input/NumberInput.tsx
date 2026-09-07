import { ChangeEvent, ComponentProps, FC, MouseEvent } from "react";
import classNames from "classnames";
import { Icons, NumberInputProps, SizeVariant, useTheme } from "@ui";
import { Button } from "../../button";
import styles from './number-input.module.css';

export const NumberInput: FC<Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type' | 'size'> & NumberInputProps> = ({
    id,
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    onChange,
    min,
    max,
    step,
    disabled = false,
    autoSelect = false,
    ariaLabel,
    unit,
    className,
    ...props
}) => {
    const theme = useTheme();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const parsed = Number(e.target.value);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    };

    const handleClick = (e: MouseEvent<HTMLInputElement>) => {
        if (autoSelect) {
            e.currentTarget.select();
        }
    };

    const handleIncrement = () => {
        if (disabled) return;
        const newValue = value + (step || 1);
        if (max !== undefined && newValue > max) return;
        onChange(newValue);
    };

    const handleDecrement = () => {
        if (disabled) return;
        const newValue = value - (step || 1);
        if (min !== undefined && newValue < min) return;
        onChange(newValue);
    };

    const buttonSizes: { [key in SizeVariant]: SizeVariant } = {
        xs: 'xs',
        sm: 'xs',
        md: 'sm',
    };

    return (
        <div className={classNames(
            styles.container,
            styles[`mode-${theme.mode}`],
            styles[`color-${color}`],
            styles[`highlight-${highlightColor}`],
            styles[`size-${size}`],
            styles[`variant-${variant}`],
        )}>
            {typeof label === 'string' ? (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            ) : label}
            <div className={styles['input-wrapper']}>
                <div className={styles['input-with-unit']}>
                    <input
                        id={id}
                        type="number"
                        value={value}
                        onChange={handleChange}
                        onClick={handleClick}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
                        className={classNames(styles.input, className)}
                        {...props}
                    />
                    {unit ? <span className={styles['unit']}>{unit}</span> : null}
                </div>
                <div className={styles.steppers}>
                    <Button
                        icon={Icons.NounProject.ChevronDownSingle}
                        iconRotateZ={180}
                        onClick={handleIncrement}
                        disabled={disabled || (max !== undefined && value >= max)}
                        color={color}
                        size={buttonSizes[size]}
                        tabIndex={-1}
                        className={styles['stepper-btn']}
                        aria-label="Increment"
                    />
                    <Button
                        icon={Icons.NounProject.ChevronDownSingle}
                        onClick={handleDecrement}
                        disabled={disabled || (min !== undefined && value <= min)}
                        color={color}
                        tabIndex={-1}
                        size={buttonSizes[size]}
                        className={styles['stepper-btn']}
                        aria-label="Decrement"
                    />
                </div>
            </div>
        </div>
    );
};
