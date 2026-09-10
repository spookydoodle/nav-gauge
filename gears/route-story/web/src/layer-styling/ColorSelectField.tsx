import { FC, useRef, useState } from "react";
import { useTranslation } from "@apparatus";
import { useTheme } from "@ui";
import { Popup, Tooltip } from "@web-ui";
import { ColorPicker } from "@web-ui";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import styles from './color-select-field.module.css';

interface Props {
    label?: string;
    value: string;
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    onChange: (color: string) => void;
}

export const ColorSelectField: FC<Props> = ({
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
                        className={styles['swatch']}
                        style={{
                            backgroundColor: value,
                            borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                        }}
                        aria-haspopup="dialog"
                        aria-expanded={open}
                        aria-label={label}
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
