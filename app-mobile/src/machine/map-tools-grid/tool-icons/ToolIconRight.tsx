import { ComponentType, FC } from "react";
import { ObservedToolIcon, useTranslation } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
import { Button } from "@mobile-ui";
import { T, MobileMap } from "@mobile-apparatus";
import { SvgProps } from "react-native-svg";

interface Props {
    map: MobileMap;
    className?: string;
}

export const ToolIconRight: FC<ObservedToolIcon<MobileMap> & Props> = ({
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
        <Button
            forwardRef={(r) => {
                anchorRef$.next({ current: r });
            }}
            accessibilityLabel={ariaLabel}
            icon={icon as unknown as ComponentType<SvgProps>}
            iconRotateX={pitch}
            iconRotateZ={-rotate}
            tooltip={<T {...effectiveTooltip} />}
            tooltipPlacement="left"
            showTooltipConnection
            size="xs"
            variant="fill-inverse"
            corners="hexagon"
            glowStyle={theme.isDark ? "animate-borders-glow" : 'none'}
            color="primary"
            active={active}
            onPress={() => onClick?.(map)}
            disabled={disabled}
        >
            {value}
        </Button>
    );
};
