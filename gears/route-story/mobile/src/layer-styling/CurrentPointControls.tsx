import { FC } from "react";
import { useMultipleTranslations } from "@apparatus";
import { currentPointIconNames, CurrentPointIconName, CurrentPointStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";
import { Dropdown, IconRotateInput, Label, NumberInput, ToggleSwitch } from "@mobile-ui";
import { StyleSheet, View } from "react-native";
import { ColorSelectField } from "./ColorSelectField";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    value: CurrentPointStyle;
    onChange: (patch: Partial<CurrentPointStyle>) => void;
}

const iconOptions = currentPointIconNames.map((icon: CurrentPointIconName) => ({
    value: icon,
    label: icon.replace(/([a-z\d])([A-Z])/g, '$1 $2').replace(/(\D)(\d+)/g, '$1 $2'),
    icon: icon === 'Circle' ? Icons.Circle : Icons.NounProject[icon],
}));

const rotationAlignmentOptions = (mapLabel: string, viewportLabel: string): { value: CurrentPointStyle['rotationAlignment']; label: string }[] => [
    { value: 'map', label: mapLabel },
    { value: 'viewport', label: viewportLabel },
];

export const CurrentPointControls: FC<Props> = ({ gearId, translationKey, value, onChange }) => {
    const [colorLabel, sizeLabel, iconLabel, autoRotateLabel, rotationLabel, rotationAlignmentLabel, mapLabel, viewportLabel] = useMultipleTranslations([
        { n: gearId, t: translationKey.Color },
        { n: gearId, t: translationKey.Size },
        { n: gearId, t: translationKey.Icon },
        { n: gearId, t: translationKey.AutoRotate },
        { n: gearId, t: translationKey.Rotation },
        { n: gearId, t: translationKey.RotationAlignment },
        { n: gearId, t: translationKey.Map },
        { n: gearId, t: translationKey.Viewport },
    ]);

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Label>{iconLabel}</Label>
                <Dropdown value={value.icon} options={iconOptions} size="xs" onChange={(icon) => onChange({ icon })} />
            </View>
            <View style={styles.grid}>
                <ColorSelectField label={colorLabel} value={value.fillColor} gearId={gearId} translationKey={translationKey} onChange={(fillColor) => onChange({ fillColor })} />
                <View style={styles['grid-fill']}>
                    <NumberInput ariaLabel={sizeLabel} size="xs" min={0.1} max={4} step={0.1} value={value.size} onChange={(size) => onChange({ size })} />
                </View>
            </View>
            <View style={styles['rotation-grid']}>
                <View style={styles['rotation-control']}>
                    <Label>{autoRotateLabel}</Label>
                    <ToggleSwitch size="xs" checked={value.autoRotate} onChange={(autoRotate) => onChange({ autoRotate })} />
                </View>
                <View style={styles['rotation-control']}>
                    <Label>{rotationLabel}</Label>
                    <IconRotateInput icon={iconOptions.find((option) => option.value === value.icon)?.icon} value={value.rotation} onChange={(rotation) => onChange({ rotation })} size="xs" />
                </View>
                <View style={styles['rotation-control']}>
                    <Label>{rotationAlignmentLabel}</Label>
                    <Dropdown value={value.rotationAlignment} options={rotationAlignmentOptions(mapLabel, viewportLabel)} size="xs" onChange={(rotationAlignment) => onChange({ rotationAlignment })} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    section: {
        gap: 4,
    },
    grid: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    'grid-fill': {
        flex: 1,
    },
    'rotation-grid': {
        flexDirection: 'row',
        gap: 8,
    },
    'rotation-control': {
        flex: 1,
        gap: 4,
    },
});
