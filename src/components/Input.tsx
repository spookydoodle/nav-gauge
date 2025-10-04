import { DetailedHTMLProps, FC, InputHTMLAttributes, MouseEvent } from "react";

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

    const labelComponent = <label htmlFor={id} onClick={(e) => e.stopPropagation()}>{label}</label>;

    return (
        <div
            onClick={onContainerClick}
            className={containerClassName}
        >
            {labelPlacement === 'before' ? labelComponent : null}
            <input {...props} id={id} name={name} onClick={handleClick} />
            {labelPlacement === 'after' ? labelComponent : null}
        </div>
    );
};
