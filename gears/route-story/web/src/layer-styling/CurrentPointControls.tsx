import { FC } from "react";
import { useMultipleTranslations } from "@apparatus";
import { currentPointIconNames, CurrentPointIconName, CurrentPointStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { DropdownOption, Icons } from "@ui";
import { Dropdown, Label, NumberInput } from "@web-ui";
import { ColorSelectField } from "./ColorSelectField";
import styles from './current-point-controls.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    value: CurrentPointStyle;
    onChange: (patch: Partial<CurrentPointStyle>) => void;
}

const iconOptions: DropdownOption<CurrentPointIconName>[] = currentPointIconNames.map((icon) => ({
    value: icon,
    label: icon.replace(/([a-z\d])([A-Z])/g, '$1 $2').replace(/(\D)(\d+)/g, '$1 $2'),
    icon: icon === 'Circle' ? Icons.Circle : Icons.NounProject[icon],
}));

export const CurrentPointControls: FC<Props> = ({ gearId, translationKey, value, onChange }) => {
    const [colorLabel, outlineColorLabel, outlineWidthLabel, sizeLabel, iconLabel] = useMultipleTranslations([
        { n: gearId, t: translationKey.Color },
        { n: gearId, t: translationKey.OutlineColor },
        { n: gearId, t: translationKey.OutlineWidth },
        { n: gearId, t: translationKey.Size },
        { n: gearId, t: translationKey.Icon },
    ]);

    return (
        <div className={styles['container']}>
            <div className={styles['section']}>
                <Label>{iconLabel}</Label>
                <Dropdown className={styles['icon-dropdown']} ariaLabel={iconLabel} size="xs" value={value.icon} options={iconOptions} onChange={(icon) => onChange({ icon })} />
            </div>
            <div className={styles['grid']}>
                <ColorSelectField label={colorLabel} value={value.fillColor} gearId={gearId} translationKey={translationKey} onChange={(fillColor) => onChange({ fillColor })} />
                <NumberInput ariaLabel={sizeLabel} size="xs" min={0.1} max={4} step={0.1} value={value.size} onChange={(size) => onChange({ size })} />
            </div>
            <div className={styles['grid']}>
                <ColorSelectField label={outlineColorLabel} value={value.outlineColor} gearId={gearId} translationKey={translationKey} onChange={(outlineColor) => onChange({ outlineColor })} />
                <NumberInput ariaLabel={outlineWidthLabel} size="xs" min={0} max={8} step={0.1} value={value.outlineWidth} onChange={(outlineWidth) => onChange({ outlineWidth })} unit="px" />
            </div>
        </div>
    );
};
