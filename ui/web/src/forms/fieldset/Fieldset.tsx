import { CSSProperties, FC, useState } from "react"
import classNames from "classnames";
import { FieldsetProps, Icons, useTheme } from "@ui";
import { Icon } from "../../icons";
import styles from './fieldset.module.css';

interface Props {
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    className?: string;
    style?: CSSProperties;
    contentClassName?: string;
}

export const Fieldset: FC<Omit<FieldsetProps, 'expanded' | 'onExpandedChange'> & Props> = ({
    label,
    prepend,
    append,
    size = 'sm',
    color = 'neutral',
    variant,
    expandable = true,
    expanded: controlledExpanded,
    onExpandedChange,
    className,
    contentClassName,
    style,
    children
}) => {
    const theme = useTheme();
    const [internalExpanded, setInternalExpanded] = useState(true);
    const isExpanded = controlledExpanded ?? internalExpanded;

    const handleToggle = () => {
        onExpandedChange?.(!isExpanded);
        setInternalExpanded(!isExpanded);
    };

    return (
        <fieldset
            className={classNames(
                styles.fieldset,
                styles[`size-${size}`],
                styles[`mode-${theme.mode}`],
                {
                    [styles[`color-${color}`]]: !!color,
                    [styles[`variant-${variant}`]]: !!variant,
                    [styles['collapsed']]: !isExpanded
                },
                className
            )}
            style={style}
        >
            <legend
                className={classNames(
                    styles.legend,
                    {
                        [styles['legend-expandable']]: expandable,
                        [styles['with-append']]: !!append,
                    }
                )}
                onClick={expandable ? handleToggle : undefined}
            >
                {expandable && (
                    <span className={classNames(styles['chevron'], { [styles['chevron-expanded']]: isExpanded })}>
                        <Icon src={Icons.NounProject.ChevronDownDoubleTriangle} width={12} height={12} color={`var(--color-${color})`} />
                    </span>
                )}
                {prepend && <span className={styles['prepend']}>{prepend}</span>}
                <span className={styles['label']}>{label}</span>
                {append && <span className={styles['append']}>{append}</span>}
            </legend>
            {expandable && (
                <div className={classNames(styles['content'], { [styles['content-collapsed']]: !isExpanded })}>
                    <div className={classNames(styles['content-inner'], contentClassName)}>
                        {children}
                    </div>
                </div>
            )}
            {!expandable && (
                <div className={classNames(styles['content'], contentClassName)}>
                    {children}
                </div>
            )}
        </fieldset>
    );
};
