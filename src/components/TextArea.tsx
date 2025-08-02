import { FC, DetailedHTMLProps, TextareaHTMLAttributes, MouseEvent } from "react";

interface Props {
    label: string;
    /**
     * Defaults to `before`.
     */
    labelPlacement?: 'before' | 'after';
    name: string;
    autoSelect?: boolean;
    onContainerClick?: (event: MouseEvent<HTMLDivElement>) => void;
    containerClassName?: string;
}

export const TextArea: FC<Props & Omit<DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, 'name'>> = ({
    label,
    labelPlacement = 'before',
    autoSelect,
    name,
    onClick,
    onContainerClick,
    containerClassName,
    ...props
}) => {
    const handleClick = (event: MouseEvent<HTMLTextAreaElement>) => {
        if (autoSelect) {
            event.currentTarget.select();
        }
        onClick?.(event);
    };

    const labelComponent = <label htmlFor={name}>{label}</label>;

    return (
        <div onClick={onContainerClick} className={containerClassName}>
            {labelPlacement === 'before' ? labelComponent : null}
            <textarea  {...props} name={name} onClick={handleClick} />
            {labelPlacement === 'after' ? labelComponent : null}
        </div>
    );
};
