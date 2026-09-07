import { FC, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { ToolPopupProps, useMultipleTranslations } from "@apparatus";
import { getDefaultRouteStoryState, CurrentPointStyle, RouteStoryLayerStylingPopupProps, RouteStoryLineStyle, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useTheme } from "@ui";
import { Button, Fieldset, Panel, Popup } from "@web-ui";
import { useSubjectState } from "@tinker-chest";
import { WebRouteStoryProps } from "../model";
import { CurrentPointControls } from "./CurrentPointControls";
import { LineStyleGroup } from "./LineStyleGroup";
import { DemoLine } from "./demo-line/DemoLine";
import styles from './layer-styling.module.css';

const hasCustomStyling = (current: RouteStoryState, defaults: RouteStoryState): boolean =>
    JSON.stringify(current.routeStyleActive) !== JSON.stringify(defaults.routeStyleActive) ||
    JSON.stringify(current.routeStyleInactive) !== JSON.stringify(defaults.routeStyleInactive) ||
    JSON.stringify(current.currentPoint) !== JSON.stringify(defaults.currentPoint);

export const LayerStylingPopup: FC<ToolPopupProps<maplibregl.Map> & RouteStoryLayerStylingPopupProps<maplibregl.Map> & WebRouteStoryProps> = ({
    icon,
    onClose,
    gearId,
    translationKey,
    state$,
}) => {
    const theme = useTheme();
    const [active] = useSubjectState(icon.active$);
    const [anchorRef] = useSubjectState(icon.anchorRef$);
    const [state, setState] = useSubjectState(state$);
    const [stylesExpanded, setStylesExpanded] = useState(true);
    const [currentPointExpanded, setCurrentPointExpanded] = useState(false);
    const [
        currentPointLabel,
        activeLabel,
        inactiveLabel,
        restoreDefaultsLabel,
        closeLabel,
        dialogLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.CurrentPoint },
        { n: gearId, t: translationKey.Active },
        { n: gearId, t: translationKey.Inactive },
        { n: gearId, t: translationKey.RestoreDefaults },
        { n: gearId, t: translationKey.Close },
        { n: gearId, t: translationKey.OpenLayerAestheticOptions },
    ]);

    const setActiveLine = (patch: Partial<RouteStoryLineStyle>) => setState((prev) => ({ ...prev, routeStyleActive: { ...prev.routeStyleActive, ...patch } }));
    const setInactiveLine = (patch: Partial<RouteStoryLineStyle>) => setState((prev) => ({ ...prev, routeStyleInactive: { ...prev.routeStyleInactive, ...patch } }));
    const setCurrentPoint = (patch: Partial<CurrentPointStyle>) => setState((prev) => ({ ...prev, currentPoint: { ...prev.currentPoint, ...patch } }));

    const toggleCurrentPointExpanded = () => setCurrentPointExpanded((prev) => !prev);

    if (!active || !anchorRef?.current) {
        return null;
    }

    const defaults = getDefaultRouteStoryState(theme);

    return (
        <Popup
            visible
            anchor={anchorRef as unknown as React.RefObject<HTMLElement | null>}
            triggerAnchor="top-right"
            popupAnchor="top-left"
            dismissOnClickAway={false}
            onClose={onClose}
        >
            <Panel
                variant="fill-inverse"
                className={styles['popup']}
                role="dialog"
                aria-label={dialogLabel}
            >
                <DemoLine state={state} onCurrentPointClick={toggleCurrentPointExpanded} currentPointMenuLabel={currentPointLabel} />
                <div className={styles['content']}>
                    <Fieldset size="xs" label={currentPointLabel} expanded={currentPointExpanded} onExpandedChange={setCurrentPointExpanded}>
                        <CurrentPointControls
                            gearId={gearId}
                            translationKey={translationKey}
                            value={state.currentPoint}
                            onChange={setCurrentPoint}
                        />
                    </Fieldset>
                    <div className={styles['style-row']}>
                        <LineStyleGroup
                            label={activeLabel}
                            style={state.routeStyleActive}
                            gearId={gearId}
                            translationKey={translationKey}
                            expanded={stylesExpanded}
                            onExpandedChange={setStylesExpanded}
                            onChange={setActiveLine}
                        />
                        <LineStyleGroup
                            label={inactiveLabel}
                            style={state.routeStyleInactive}
                            gearId={gearId}
                            translationKey={translationKey}
                            expanded={stylesExpanded}
                            onExpandedChange={setStylesExpanded}
                            onChange={setInactiveLine}
                        />
                    </div>
                </div>
                <div className={styles['footer']}>
                    {hasCustomStyling(state, defaults) ? (
                        <Button variant="ghost" size="xs" onClick={() => setState(defaults)}>
                            {restoreDefaultsLabel}
                        </Button>
                    ) : null}
                    <Button variant="fill" size="xs" onClick={onClose}>
                        {closeLabel}
                    </Button>
                </div>
            </Panel>
        </Popup>
    );
};