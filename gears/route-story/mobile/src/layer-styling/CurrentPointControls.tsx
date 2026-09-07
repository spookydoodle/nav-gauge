import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useMultipleTranslations } from "@apparatus";
import { currentPointSizeOptions, CurrentPointStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button, Label, Radio } from "@mobile-ui";
import { ColorSelectField } from "./ColorSelectField";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    value: CurrentPointStyle;
    onChange: (patch: Partial<CurrentPointStyle>) => void;
}

export const CurrentPointControls: FC<Props> = ({ gearId, translationKey, value, onChange }) => {
    const [colorLabel, outlineColorLabel, sizeLabel, shapeLabel, circleLabel, triangleLabel] = useMultipleTranslations([
        { n: gearId, t: translationKey.Color },
        { n: gearId, t: translationKey.OutlineColor },
        { n: gearId, t: translationKey.Size },
        { n: gearId, t: translationKey.Shape },
        { n: gearId, t: translationKey.Circle },
        { n: gearId, t: translationKey.Triangle },
    ]);

    const currentPointOption = currentPointSizeOptions.find((option) => option.radius === value.size);

    return (
        <>
            <ColorSelectField label={colorLabel} value={value.fillColor} gearId={gearId} translationKey={translationKey} onChange={(fillColor) => onChange({ fillColor })} />
            <ColorSelectField label={outlineColorLabel} value={value.outlineColor} gearId={gearId} translationKey={translationKey} onChange={(outlineColor) => onChange({ outlineColor })} />
            <Label style={styles.controlLabel}>{sizeLabel}</Label>
            <View style={styles.sizeRow}>
                {currentPointSizeOptions.map((option) => (
                    <Button key={option.label} size="xs" variant={option === currentPointOption ? "fill" : "outline"} onPress={() => onChange({ size: option.radius })}>
                        {option.label}
                    </Button>
                ))}
            </View>
            <Label style={styles.controlLabel}>{shapeLabel}</Label>
            <Radio size="xs" checked={value.shape.type === 'simple' && value.shape.shape === 'circle'} onChange={(checked) => {
                if (checked) {
                    onChange({ shape: { type: 'simple', shape: 'circle' } });
                }
            }}>
                {circleLabel}
            </Radio>
            <Radio size="xs" checked={value.shape.type === 'simple' && value.shape.shape === 'triangle'} onChange={(checked) => {
                if (checked) {
                    onChange({ shape: { type: 'simple', shape: 'triangle' } });
                }
            }}>
                {triangleLabel}
            </Radio>
        </>
    );
};

const styles = StyleSheet.create({
    controlLabel: {
        marginTop: 2,
    },
    sizeRow: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 2,
    },
});