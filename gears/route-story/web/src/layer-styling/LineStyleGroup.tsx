import { FC } from "react";
import { DropdownOption } from "@ui";
import { RouteStoryLineStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Checkbox, Dropdown, Label, NumberInput } from "@web-ui";
import { ColorSelectField } from "./ColorSelectField";
import { useMultipleTranslations } from "@apparatus";
import styles from './line-style-group.module.css';

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

    const variantOptions: DropdownOption<'solid' | 'dashed'>[] = [
        { label: solidLabel, value: 'solid' as const },
        { label: dashedLabel, value: 'dashed' as const },
    ].filter((option) => option.label != null);

    return (
        <div>
            <div className={styles['top-controls']}>
                <Checkbox size="xs" checked={style.showRouteLine} onChange={(checked) => onChange({ showRouteLine: checked })}>
                    {linesLabel}
                </Checkbox>
                <Dropdown ariaLabel={lineStyleLabel} size="xs" value={style.variant} options={variantOptions} onChange={(variant) => onChange({ variant })} />
                <Checkbox size="xs" checked={style.showRoutePoints} onChange={(checked) => onChange({ showRoutePoints: checked })}>
                    {pointsLabel}
                </Checkbox>
            </div>
            <Label>{lineLabel}</Label>
            <div className={styles['grid']}>
                <ColorSelectField value={style.color} gearId={gearId} translationKey={translationKey} onChange={(color) => onChange({ color })} />
                <NumberInput size="xs" min={1} max={8} step={1} value={style.width} onChange={(width) => onChange({ width })} unit="px" />
            </div>
            <Label>{outlineLabel}</Label>
            <div className={styles['grid']}>
                <ColorSelectField value={style.outlineColor} gearId={gearId} translationKey={translationKey} onChange={(outlineColor) => onChange({ outlineColor })} />
                <NumberInput size="xs" min={0} max={4} step={1} value={style.outlineWidth} onChange={(outlineWidth) => onChange({ outlineWidth })} unit="px" />
            </div>
        </div>
    );
};
