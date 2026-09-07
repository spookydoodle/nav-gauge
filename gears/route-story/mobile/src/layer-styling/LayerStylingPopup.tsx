import { FC, useMemo, useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ToolPopupProps, useMultipleTranslations } from "@apparatus";
import { getIconAnchorPoint, getMenuPosition, MenuPosition, useTheme } from "@ui";
import { getDefaultRouteStoryState, CurrentPointStyle, RouteStoryLayerStylingPopupProps, RouteStoryLineStyle, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";
import { MobileRouteStoryProps } from "../model";
import { Button, Fieldset } from "@mobile-ui";
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

    const menuPosition = useMemo<MenuPosition>(() => {
        if (!active) {
            return {};
        }
        const anchor = anchorRef?.current;
        if (!anchor) {
            return {};
        }
        const rect = anchor.getBoundingClientRect();
        const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
        const point = getIconAnchorPoint('top-right', rect.left, rect.top, rect.width, rect.height);

        return getMenuPosition('top-left', point, windowWidth, windowHeight);
    }, [active, anchorRef]);

    const defaults = getDefaultRouteStoryState(theme);
    const isDirty = hasCustomStyling(state, defaults);

    return (
        <>
            <Modal visible={!!active} transparent animationType="fade" onRequestClose={onClose}>
                <Pressable style={styles.overlay}>
                    <View
                        style={[
                            styles.popup,
                            {
                                ...menuPosition,
                                backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                                borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                            },
                        ]}
                        accessibilityRole="dialog"
                        accessibilityLabel={dialogLabel}
                    >
                        <DemoLine state={state} onCurrentPointClick={toggleCurrentPointExpanded} currentPointMenuLabel={currentPointLabel} />
                        <ScrollView contentContainerStyle={styles.content}>
                            <Fieldset size="xs" label={currentPointLabel} expanded={currentPointExpanded} onExpandedChange={setCurrentPointExpanded}>
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
                        <View style={styles.footer}>
                            {isDirty && (
                                <Button size="xs" onPress={() => setState(defaults)}>
                                    {restoreDefaultsLabel}
                                </Button>
                            )}
                            <Button size="xs" onPress={onClose}>
                                {closeLabel}
                            </Button>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        position: 'absolute',
        width: Math.min(300, Dimensions.get('window').width - 16),
        maxHeight: '70%',
        borderWidth: 1,
        padding: 12,
        gap: 10,
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
    },
});