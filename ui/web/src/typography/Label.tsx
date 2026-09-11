import { ComponentProps, FC } from "react";
import classNames from "classnames";
import { defaultTypographyProps, LabelProps, TypographyProps } from "@ui";
import { textCssNames } from "./cssUtil";
import styles from './typography.module.css';

export const Label: FC<ComponentProps<'label'> & TypographyProps & LabelProps> = ({
    color,
    fontType = defaultTypographyProps.fontType,
    align,
    nowrap,
    bold,
    shadow,
    tabular,
    m,
    mv,
    mh,
    mt,
    mr,
    mb,
    ml,
    p,
    pv,
    ph,
    pt,
    pr,
    pb,
    pl,
    className,
    disabled = false,
    children,
    ...props
}) => {
    const cssNames = textCssNames({
        color,
        fontType,
        align,
        nowrap,
        bold,
        shadow,
        tabular,
        m,
        mv,
        mh,
        mt,
        mr,
        mb,
        ml,
        p,
        pv,
        ph,
        pt,
        pr,
        pb,
        pl,
        className,
    });
    return (
        <label className={classNames(styles.label, ...cssNames, { [styles.disabled]: disabled })} {...props}>
            {children}
        </label>
    );
};
