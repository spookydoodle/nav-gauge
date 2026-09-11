import { CSSProperties, FC, useRef, useState } from "react";
import classNames from "classnames";
import { useTranslation } from "@apparatus";
import { useTheme } from "@ui";
import { Popup, Tooltip } from "@web-ui";
import { ColorPicker } from "@web-ui";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import styles from './color-select-field.module.css';

interface Props {
    disabled?: boolean;
    label?: string;
    value: string;
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    onChange: (color: string) => void;
}

export const ColorSelectField: FC<Props> = ({
    disabled = false,
    label,
    value,
    gearId,
    translationKey,
    onChange,
}) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const opacityLabel = useTranslation({ n: gearId, t: translationKey.Opacity });

    const handleColorChange = (color: string) => {
        onChange(color);
    };

    return (
        <>
            <div className={styles['field']}>
                <Tooltip content={label} placement="top">
                    <button
                        type="button"
                        ref={anchorRef}
                        className={classNames(styles['swatch'], styles[`mode-${theme.mode}`], { [styles['disabled']]: disabled })}
                        style={{ '--swatch-color': value } as CSSProperties}
                        aria-haspopup="dialog"
                        aria-expanded={open}
                        aria-label={label}
                        disabled={disabled}
                        onClick={() => setOpen((current) => !current)}
                    />
                </Tooltip>
            </div>
            <Popup
                visible={open}
                anchor={anchorRef}
                variant="fill-inverse"
                triggerAnchor="bottom-left"
                popupAnchor="top-left"
                onClose={() => setOpen(false)}
                popupClassName={styles['color-popup']}
            >
                <div role="dialog" aria-label={label}>
                    <ColorPicker label={label} value={value} opacityLabel={opacityLabel} onChange={handleColorChange} />
                </div>
            </Popup>
        </>
    );
};
