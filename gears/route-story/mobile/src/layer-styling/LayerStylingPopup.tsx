import { FC, useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { ToolPopupProps, useMultipleTranslations } from "@apparatus";
import { useTheme } from "@ui";
import { getDefaultRouteStoryState, CurrentPointStyle, RouteStoryLayerStylingPopupProps, RouteStoryLineStyle, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";
import { MobileRouteStoryProps } from "../model";
import { Button, Fieldset, Popup } from "@mobile-ui";
import { CurrentPointControls } from "./CurrentPointControls";
import { LineStyleGroup } from "./LineStyleGroup";
import { DemoLine } from "./demo-line/DemoLine";

const hasCustomStyling = (current: RouteStoryState, defaults: RouteStoryState): boolean =>
    JSON.stringify(current.routeStyleActive) !== JSON.stringify(defaults.routeStyleActive) ||
    JSON.stringify(current.routeStyleInactive) !== JSON.stringify(defaults.routeStyleInactive) ||
    JSON.stringify(current.currentPoint) !== JSON.stringify(defaults.currentPoint);

export const LayerStylingPopup: FC<ToolPopupProps<MobileMap> & RouteStoryLayerStylingPopupProps<MobileMap> & MobileRouteStoryProps> = ({
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
    const [currentPointExpanded, setCurrentPointExpanded] = useState(false);
    const [stylesExpanded, setStylesExpanded] = useState(true);
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

    useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            if (active) {
                onClose();
                return true;
            }
            return false;
        });
        return () => subscription.remove();
    }, [active, onClose]);

    const defaults = getDefaultRouteStoryState(theme);
    const isDirty = hasCustomStyling(state, defaults);

    return (
        <Popup
            visible={active && !!anchorRef?.current}
            anchor={anchorRef as unknown as React.RefObject<HTMLElement | null>}
            triggerAnchor="bottom-left"
            popupAnchor="top-left"
            dismissOnClickAway={false}
            onClose={onClose}
            popupStyle={[
                styles.popup,
                {
                    backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                    borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                },
            ]}
        >
            <View style={styles['demo-section']} accessibilityLabel={dialogLabel}>
                <DemoLine state={state} onCurrentPointClick={toggleCurrentPointExpanded} currentPointMenuLabel={currentPointLabel} />
            </View>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <Fieldset size="xs" label={currentPointLabel} color="neutral" variant="fill-inverse" expanded={currentPointExpanded} onExpandedChange={setCurrentPointExpanded}>
                    <CurrentPointControls gearId={gearId} translationKey={translationKey} value={state.currentPoint} onChange={setCurrentPoint} />
                </Fieldset>
                <View style={styles['style-row']}>
                    <View style={styles['style-col']}>
                        <LineStyleGroup
                            label={activeLabel}
                            style={state.routeStyleActive}
                            gearId={gearId}
                            translationKey={translationKey}
                            expanded={stylesExpanded}
                            onExpandedChange={setStylesExpanded}
                            onChange={setActiveLine}
                        />
                    </View>
                    <View style={styles['style-col']}>
                        <LineStyleGroup
                            label={inactiveLabel}
                            style={state.routeStyleInactive}
                            gearId={gearId}
                            translationKey={translationKey}
                            expanded={stylesExpanded}
                            onExpandedChange={setStylesExpanded}
                            onChange={setInactiveLine}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.footer, { backgroundColor: theme.color('neutral', theme.isDark ? 900 : 100) }]}>
                {isDirty && (
                    <Button size="xs" variant="ghost" onPress={() => setState(defaults)}>
                        {restoreDefaultsLabel}
                    </Button>
                )}
                <Button size="xs" variant="fill" onPress={onClose}>
                    {closeLabel}
                </Button>
            </View>
        </Popup>
    );
};

const styles = StyleSheet.create({
    popup: {
        width: '100%',
        maxWidth: 320,
        maxHeight: '70%',
        borderWidth: 1,
    },
    'demo-section': {
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 4,
    },
    scroll: {
        flexShrink: 1,
    },
    'current-point-panel': {
        position: 'relative',
    },
    'demo-line': {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    'demo-point': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    'demo-point-outline': {
        position: 'absolute',
    },
    'demo-point-fill': {
        position: 'absolute',
    },
    'style-row': {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-start',
    },
    'style-col': {
        flex: 1,
    },
    content: {
        gap: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        padding: 10,
    },
});
