import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { ObservedToolIcon, useTranslation } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
import { Button, Transition } from "@web-ui";
import { T } from "@web-apparatus";

interface Props {
    map: maplibregl.Map;
    className?: string;
}

export const ToolIconLeft: FC<ObservedToolIcon<maplibregl.Map> & Props> = ({
    map,
    icon,
    anchorRef$,
    value$,
    disabled$,
    active$,
    rotate$,
    pitch$,
    tooltip,
    onClick,
    className,
}) => {
    const theme = useTheme();
    const [value] = useSubjectState(value$);
    const [disabled] = useSubjectState(disabled$);
    const [active] = useSubjectState(active$);
    const [rotate] = useSubjectState(rotate$);
    const [pitch] = useSubjectState(pitch$);
    const effectiveTooltip = typeof tooltip === 'function' ? tooltip(value) : tooltip;
    const ariaLabel = useTranslation(effectiveTooltip);

    return (
        <Transition fade render>
            <Button
                ref={(r) => {
                    anchorRef$.next({ current: r });
                }}
                aria-label={ariaLabel}
                icon={icon}
                iconRotateZ={pitch}
                iconRotateX={-rotate}
                tooltip={<T {...effectiveTooltip} />}
                tooltipPlacement="right"
                showTooltipConnection
                size="sm"
                variant="fill-inverse"
                corners="hexagon"
                glowStyle={theme.isDark ? "animate-borders-glow" : 'none'}
                highlightColor="secondary"
                active={active}
                onClick={() => onClick?.(map)}
                disabled={disabled}
                className={className}
            />
        </Transition>
    );
};
