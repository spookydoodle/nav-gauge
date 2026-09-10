import { FC } from "react";
import { RouteStoryLineStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Checkbox, Dropdown, Label, NumberInput } from "@mobile-ui";
import { ColorSelectField } from "./ColorSelectField";
import { View, StyleSheet } from "react-native";
import { useMultipleTranslations } from "@apparatus";

interface Props {
    style: RouteStoryLineStyle;
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    onChange: (patch: Partial<RouteStoryLineStyle>) => void;
}

export const LineStyleGroup: FC<Props> = ({
    style,
    gearId,
    translationKey,
    onChange,
}) => {
    const [
        linesLabel,
        pointsLabel,
        lineStyleLabel,
        solidLabel,
        dashedLabel,
        lineLabel,
        outlineLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Lines },
        { n: gearId, t: translationKey.Points },
        { n: gearId, t: translationKey.LineStyle },
        { n: gearId, t: translationKey.Solid },
        { n: gearId, t: translationKey.Dashed },
        { n: gearId, t: translationKey.Line },
        { n: gearId, t: translationKey.Outline },
    ]);

    const variantOptions = [
        { label: solidLabel, value: 'solid' as const },
        { label: dashedLabel, value: 'dashed' as const },
    ];

    return (
        <View>
            <View style={styles['top-controls']}>
                <Checkbox size="xs" checked={style.showRouteLine} onChange={(checked) => onChange({ showRouteLine: checked })}>
                    {linesLabel}
                </Checkbox>
                <Checkbox size="xs" checked={style.showRoutePoints} onChange={(checked) => onChange({ showRoutePoints: checked })}>
                    {pointsLabel}
                </Checkbox>
            </View>
            <Label style={styles['variant-label']}>{lineStyleLabel}</Label>
            <Dropdown size="xs" value={style.variant} options={variantOptions} onChange={(variant) => onChange({ variant })} />
            <Label style={styles['section-label']}>{lineLabel}</Label>
            <View style={styles['grid']}>
                <ColorSelectField value={style.color} gearId={gearId} translationKey={translationKey} onChange={(color) => onChange({ color })} />
                <View style={styles['grid-fill']}>
                    <NumberInput size="xs" min={1} max={8} step={1} value={style.width} onChange={(width) => onChange({ width })} unit="px" />
                </View>
            </View>
            <Label style={styles['section-label']}>{outlineLabel}</Label>
            <View style={styles['grid']}>
                <ColorSelectField value={style.outlineColor} gearId={gearId} translationKey={translationKey} onChange={(outlineColor) => onChange({ outlineColor })} />
                <View style={styles['grid-fill']}>
                    <NumberInput size="xs" min={0} max={4} step={1} value={style.outlineWidth} onChange={(outlineWidth) => onChange({ outlineWidth })} unit="px" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    'top-controls': {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    'variant-label': {
        marginBottom: -4,
    },
    'section-label': {
        marginBottom: -6,
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
