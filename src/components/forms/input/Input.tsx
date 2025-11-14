import { DetailedHTMLProps, FC, InputHTMLAttributes, MouseEvent } from "react";
import classNames from "classnames";
import * as styles from './input.module.css';

interface Props {
    label: string;
    /**
     * Defaults to `before`.
     */
    labelPlacement?: 'before' | 'after';
    id: string;
    name: string;
    autoSelect?: boolean;
    onContainerClick?: (event: MouseEvent<HTMLDivElement>) => void;
    containerClassName?: string;
}

export const Input: FC<Props & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'name' | 'id'>> = ({
    label,
    labelPlacement = 'before',
    autoSelect,
    id,
    name,
    onClick,
    onContainerClick,
    containerClassName,
    ...props
}) => {
    const handleClick = (event: MouseEvent<HTMLInputElement>) => {
        if (autoSelect) {
            event.currentTarget.select();
        }
        onClick?.(event);
    };

    const labelComponent = (
        <label htmlFor={id} onClick={(e) => e.stopPropagation()} className={styles.label}>
            {label}
        </label>
    );

    return (
        <div
            onClick={onContainerClick}
            className={classNames(styles.container, containerClassName)}
        >
            {labelPlacement === 'before' ? labelComponent : null}
            <input {...props} id={id} name={name} onClick={handleClick} className={styles.input} />
            {labelPlacement === 'after' ? labelComponent : null}
        </div>
    );
};
