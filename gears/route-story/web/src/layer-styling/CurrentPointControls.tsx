import { FC } from "react";
import { useMultipleTranslations } from "@apparatus";
import { currentPointSizeOptions, CurrentPointStyle, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button, Label, Radio } from "@web-ui";
import { ColorSelectField } from "./ColorSelectField";
import styles from './current-point-controls.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    value: CurrentPointStyle;
    onChange: (patch: Partial<CurrentPointStyle>) => void;
}

export const CurrentPointControls: FC<Props> = ({ gearId, translationKey, value, onChange }) => {
    const [
        colorLabel,
        outlineColorLabel,
        sizeLabel,
        shapeLabel,
        circleLabel,
        triangleLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Color },
        { n: gearId, t: translationKey.OutlineColor },
        { n: gearId, t: translationKey.Size },
        { n: gearId, t: translationKey.Shape },
        { n: gearId, t: translationKey.Circle },
        { n: gearId, t: translationKey.Triangle },
    ]);

    const simpleShapesOptions: { shape: 'circle' | 'triangle', label: string }[] = [
        { shape: "circle", label: circleLabel },
        { shape: "triangle", label: triangleLabel }
    ];

    return (
        <div className={styles['container']}>
            <div className={styles['section']}>
                <ColorSelectField label={colorLabel} value={value.fillColor} gearId={gearId} translationKey={translationKey} onChange={(fillColor) => onChange({ fillColor })} />
                <ColorSelectField label={outlineColorLabel} value={value.outlineColor} gearId={gearId} translationKey={translationKey} onChange={(outlineColor) => onChange({ outlineColor })} />
            </div>
            <div className={styles['section']}>
                <Label>{sizeLabel}</Label>
                <div className={styles['size-row']}>
                    {currentPointSizeOptions.map((option) => (
                        <Button
                            key={option.label}
                            variant={value.size === option.radius ? "fill" : "outline"}
                            size="xs"
                            onClick={() => onChange({ size: option.radius })}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className={styles['section']}>
                <Label>
                    {shapeLabel}
                </Label>
                {simpleShapesOptions.map(({ shape, label }) => (
                    <Radio
                        size="xs"
                        checked={value.shape.type === 'simple' && value.shape.shape === shape}
                        onChange={(checked) => {
                            if (checked) {
                                onChange({ shape: { type: 'simple', shape } });
                            }
                        }}
                    >
                        {label}
                    </Radio>
                ))}
            </div>
        </div>
    );
};