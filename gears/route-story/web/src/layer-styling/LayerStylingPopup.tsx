import { FC, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { ToolPopupProps, useMultipleTranslations } from "@apparatus";
import { getDefaultRouteStoryState, CurrentPointStyle, RouteStoryLayerStylingPopupProps, RouteStoryLineStyle, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useTheme } from "@ui";
import { Button, HudConnector, Panel, Popup, Tabstrip } from "@web-ui";
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
    const [selectedStyle, setSelectedStyle] = useState('active');
    const tabstripRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<SVGLineElement>(null);
    const currentPointRef = useRef<SVGGElement>(null);
    const inactiveRef = useRef<SVGLineElement>(null);
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

    if (!active || !anchorRef?.current) {
        return null;
    }

    const defaults = getDefaultRouteStoryState(theme);
    const targetRef = selectedStyle === 'active' ? activeRef : selectedStyle === 'current-point' ? currentPointRef : inactiveRef;
    const fromAnchor = selectedStyle === 'active' ? 'top-left' : selectedStyle === 'current-point' ? 'top' : 'top-right';

    return (
        <Popup
            visible
            anchor={anchorRef as unknown as React.RefObject<HTMLElement | null>}
            triggerAnchor="bottom-left"
            popupAnchor="top-left"
            dismissOnClickAway={false}
            onClose={onClose}
        >
            <Panel
                variant="fill-translucent"
                className={styles['popup']}
                role="dialog"
                aria-label={dialogLabel}
            >
                <HudConnector fromRef={tabstripRef} toRef={targetRef} fromAnchor={fromAnchor} toAnchor="bottom" color="primary" glowStyle="glow">
                    <DemoLine state={state} onCurrentPointClick={() => setSelectedStyle('current-point')} currentPointMenuLabel={currentPointLabel} activeRef={activeRef} currentPointRef={currentPointRef} inactiveRef={inactiveRef} />
                    <div className={styles['content']}>
                        <div ref={tabstripRef}>
                            <Tabstrip
                                variant="fill-inverse"
                                spread
                                value={selectedStyle}
                                onChange={setSelectedStyle}
                                overflowAccessibilityLabel={dialogLabel}
                                options={[
                                    { value: 'current-point', label: currentPointLabel },
                                    { value: 'active', label: activeLabel },
                                    { value: 'inactive', label: inactiveLabel },
                                ]}
                            >
                                {selectedStyle === 'current-point' ? (
                                    <CurrentPointControls
                                        gearId={gearId}
                                        translationKey={translationKey}
                                        value={state.currentPoint}
                                        onChange={setCurrentPoint}
                                    />
                                ) : selectedStyle === 'active' ? (
                                    <LineStyleGroup
                                        style={state.routeStyleActive}
                                        gearId={gearId}
                                        translationKey={translationKey}
                                        onChange={setActiveLine}
                                    />
                                ) : (
                                    <LineStyleGroup
                                        style={state.routeStyleInactive}
                                        gearId={gearId}
                                        translationKey={translationKey}
                                        onChange={setInactiveLine}
                                    />
                                )}
                            </Tabstrip>
                        </div>
                    </div>
                </HudConnector>
                <Panel variant="fill-inverse" borderWidth={0} className={styles['footer']}>
                    {hasCustomStyling(state, defaults) ? (
                        <Button variant="ghost" size="xs" onClick={() => setState(defaults)}>
                            {restoreDefaultsLabel}
                        </Button>
                    ) : null}
                    <Button variant="fill" size="xs" onClick={onClose}>
                        {closeLabel}
                    </Button>
                </Panel>
            </Panel>
        </Popup>
    );
};
