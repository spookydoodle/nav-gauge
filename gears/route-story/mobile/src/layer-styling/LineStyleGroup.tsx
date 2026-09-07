import { FC } from "react";
import { RouteStoryLineStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Checkbox, Dropdown, Fieldset, NumberInput } from "@mobile-ui";
import { ColorSelectField } from "./ColorSelectField";
import { View, Text, StyleSheet } from "react-native";
import { useMultipleTranslations } from "@apparatus";

interface Props {
    label: string;
    style: RouteStoryLineStyle;
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    onChange: (patch: Partial<RouteStoryLineStyle>) => void;
}

export const LineStyleGroup: FC<Props> = ({
    label,
    style,
    gearId,
    translationKey,
    onChange,
    expanded,
    onExpandedChange,
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
        <Fieldset size="xs" label={label} expanded={expanded} onExpandedChange={onExpandedChange}>
            <View style={styles['top-controls']}>
                <Checkbox size="xs" checked={style.showRouteLine} onChange={(checked) => onChange({ showRouteLine: checked })}>
                    {linesLabel}
                </Checkbox>
                <Checkbox size="xs" checked={style.showRoutePoints} onChange={(checked) => onChange({ showRoutePoints: checked })}>
                    {pointsLabel}
                </Checkbox>
            </View>
            <Text style={styles['variant-label']}>{lineStyleLabel}</Text>
            <Dropdown size="xs" value={style.variant} options={variantOptions} onChange={(variant) => onChange({ variant })} />
            <Text style={styles['section-label']}>{lineLabel}</Text>
            <View style={styles['grid']}>
                <ColorSelectField value={style.color} gearId={gearId} translationKey={translationKey} onChange={(color) => onChange({ color })} />
                <View style={styles['grid-fill']}>
                    <NumberInput size="xs" min={1} max={8} step={1} value={style.width} onChange={(width) => onChange({ width })} unit="px" />
                </View>
            </View>
            <Text style={styles['section-label']}>{outlineLabel}</Text>
            <View style={styles['grid']}>
                <ColorSelectField value={style.outlineColor} gearId={gearId} translationKey={translationKey} onChange={(outlineColor) => onChange({ outlineColor })} />
                <View style={styles['grid-fill']}>
                    <NumberInput size="xs" min={0} max={4} step={1} value={style.outlineWidth} onChange={(outlineWidth) => onChange({ outlineWidth })} unit="px" />
                </View>
            </View>
        </Fieldset>
    );
};

const styles = StyleSheet.create({
    'top-controls': {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    'variant-label': {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    'section-label': {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    grid: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    'grid-fill': {
        flex: 1,
    },
});
