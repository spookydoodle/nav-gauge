import { FC, DetailedHTMLProps, TextareaHTMLAttributes, MouseEvent } from "react";

interface Props {
    label: string;
    name: string;
    autoSelect?: boolean;
    onContainerClick?: (event: MouseEvent<HTMLDivElement>) => void;
    containerClassName?: string;
}

export const TextArea: FC<Props & Omit<DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, 'name'>> = ({
    label,
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

    return (
        <div onClick={onContainerClick} className={containerClassName}>
            <label htmlFor={name}>{label}</label>
            <textarea  {...props} name={name} onClick={handleClick} />
        </div>
    );
};
