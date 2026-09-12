import { FC } from "react";
import { useMultipleTranslations } from "@apparatus";
import { currentPointIconNames, CurrentPointIconName, CurrentPointStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";
import { Dropdown, Label, NumberInput } from "@mobile-ui";
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

export const CurrentPointControls: FC<Props> = ({ gearId, translationKey, value, onChange }) => {
    const [colorLabel, outlineColorLabel, outlineWidthLabel, sizeLabel, iconLabel] = useMultipleTranslations([
        { n: gearId, t: translationKey.Color },
        { n: gearId, t: translationKey.OutlineColor },
        { n: gearId, t: translationKey.OutlineWidth },
        { n: gearId, t: translationKey.Size },
        { n: gearId, t: translationKey.Icon },
    ]);

    return (
        <View style={styles.container}>
            <Label>{iconLabel}</Label>
            <Dropdown value={value.icon} options={iconOptions} size="xs" onChange={(icon) => onChange({ icon })} />
            <View style={styles.grid}>
                <ColorSelectField label={colorLabel} value={value.fillColor} gearId={gearId} translationKey={translationKey} onChange={(fillColor) => onChange({ fillColor })} />
                <View style={styles['grid-fill']}>
                    <NumberInput ariaLabel={sizeLabel} size="xs" min={0.1} max={4} step={0.1} value={value.size} onChange={(size) => onChange({ size })} />
                </View>
            </View>
            <View style={styles.grid}>
                <ColorSelectField label={outlineColorLabel} value={value.outlineColor} gearId={gearId} translationKey={translationKey} onChange={(outlineColor) => onChange({ outlineColor })} />
                <View style={styles['grid-fill']}>
                    <NumberInput ariaLabel={outlineWidthLabel} size="xs" min={0} max={8} step={0.1} value={value.outlineWidth} onChange={(outlineWidth) => onChange({ outlineWidth })} unit="px" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
});
