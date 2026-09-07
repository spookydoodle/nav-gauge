import { ComponentType, FC } from "react";
import { ObservedToolIcon, useTranslation } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
import { Button } from "@mobile-ui";
import { MobileMap } from "@mobile-apparatus";
import { SvgProps } from "react-native-svg";

interface Props {
    map: MobileMap;
    className?: string;
}

export const ToolIconLeft: FC<ObservedToolIcon<MobileMap> & Props> = ({
    map,
    icon,
    anchorRef$,
    value$,
    disabled$,
    active$,
    tooltip,
    onClick,
}) => {
    const { translatron, individuator } = useMobileMachineWard();
    const theme = useTheme();
    const [value] = useSubjectState(value$);
    const [disabled] = useSubjectState(disabled$);
    const [active] = useSubjectState(active$);
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);
    const effectiveTooltip = typeof tooltip === 'function' ? tooltip(value) : tooltip;
    const ariaLabel = useTranslation(effectiveTooltip);
    const resolvedTooltip = typeof effectiveTooltip === 'object' && effectiveTooltip !== null
        ? translatron.translate(settings.language, registry, effectiveTooltip)
        : (effectiveTooltip ?? '');

    return (
        <Button
            forwardRef={(r) => {
                anchorRef$.next({ current: r });
            }}
            accessibilityLabel={ariaLabel}
            icon={icon as unknown as ComponentType<SvgProps>}
            tooltip={resolvedTooltip}
            tooltipPlacement="right"
            showTooltipConnection
            size="sm"
            variant="fill-inverse"
            corners="hexagon"
            glowStyle={theme.isDark ? "animate-borders-glow" : 'none'}
            highlightColor="secondary"
            active={active}
            onPress={() => onClick?.(map)}
            disabled={disabled}
        />
    );
};
