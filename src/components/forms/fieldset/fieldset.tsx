import { FC, ReactNode } from "react"
import classNames from "classnames";
import * as styles from './fieldset.module.css';

interface Props {
    label: string;
    className?: string;
    children?: ReactNode;
}

export const Fieldset: FC<Props> = ({
    label,
    className,
    children
}) => {

    return (
        <fieldset className={classNames(styles.fieldset, className)}>
            <legend>{label}</legend>
            {children}
        </fieldset>
    );
};
