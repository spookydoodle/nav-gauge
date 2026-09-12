import { FC, useId } from "react";
import { useMultipleTranslations } from "@apparatus";
import { currentPointIconNames, CurrentPointIconName, CurrentPointStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { DropdownOption, Icons } from "@ui";
import { Dropdown, IconRotateInput, Label, NumberInput, ToggleSwitch } from "@web-ui";
import { useWebMachineWard } from "@web-apparatus";
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

const rotationAlignmentOptions = (mapLabel: string, viewportLabel: string): DropdownOption<CurrentPointStyle['rotationAlignment']>[] => [
    { value: 'map', label: mapLabel },
    { value: 'viewport', label: viewportLabel },
];

export const CurrentPointControls: FC<Props> = ({ gearId, translationKey, value, onChange }) => {
    const { namespace, translationKey: machineTranslationKey } = useWebMachineWard();
    const autoRotateLabelId = useId();
    const rotationInputId = useId();
    const [colorLabel, sizeLabel, iconLabel, autoRotateLabel, onLabel, offLabel, rotationLabel, rotationAlignmentLabel, mapLabel, viewportLabel] = useMultipleTranslations([
        { n: gearId, t: translationKey.Color },
        { n: gearId, t: translationKey.Size },
        { n: gearId, t: translationKey.Icon },
        { n: gearId, t: translationKey.AutoRotate },
        { n: namespace, t: machineTranslationKey.On },
        { n: namespace, t: machineTranslationKey.Off },
        { n: gearId, t: translationKey.Rotation },
        { n: gearId, t: translationKey.RotationAlignment },
        { n: gearId, t: translationKey.Map },
        { n: gearId, t: translationKey.Viewport },
    ]);

    return (
        <div className={styles['container']}>
            <div className={styles['appearance-grid']}>
                <div className={styles['section']}>
                    <Label>{iconLabel}</Label>
                    <Dropdown className={styles['icon-dropdown']} ariaLabel={iconLabel} size="xs" value={value.icon} options={iconOptions} onChange={(icon) => onChange({ icon })} />
                </div>
                <div className={styles['grid']}>
                    <ColorSelectField label={colorLabel} value={value.fillColor} gearId={gearId} translationKey={translationKey} onChange={(fillColor) => onChange({ fillColor })} />
                    <NumberInput ariaLabel={sizeLabel} size="xs" min={0.1} max={4} step={0.1} value={value.size} onChange={(size) => onChange({ size })} />
                </div>
            </div>
            <div className={styles['rotation-grid']}>
                <div className={styles['section']}>
                    <Label>{rotationAlignmentLabel}</Label>
                    <Dropdown ariaLabel={rotationAlignmentLabel} size="xs" value={value.rotationAlignment} options={rotationAlignmentOptions(mapLabel, viewportLabel)} onChange={(rotationAlignment) => onChange({ rotationAlignment })} />
                </div>
                <div className={styles['section']}>
                    <Label htmlFor={rotationInputId} tabular>{rotationLabel}<br />{value.rotation}°</Label>
                    <IconRotateInput id={rotationInputId} icon={iconOptions.find((option) => option.value === value.icon)?.icon} value={value.rotation} onChange={(rotation) => onChange({ rotation })} size="xs" />
                </div>
                <div className={styles['section']}>
                    <Label id={autoRotateLabelId}>{autoRotateLabel}<br />{value.autoRotate ? onLabel : offLabel}</Label>
                    <ToggleSwitch labelledBy={autoRotateLabelId} size="xs" checked={value.autoRotate} onChange={(autoRotate) => onChange({ autoRotate })} />
                </div>
            </div>
        </div>
    );
};
