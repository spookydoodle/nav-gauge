import { FC, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Menu, MenuItem } from "@mobile-ui";
import { assignSideToolPanelRef, swapSideToolPanelPlacement, useSideToolPanel } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useTheme } from "@ui";
import { ToolPanelHeader } from "../panel-header/ToolPanelHeader";
import { SideToolPanelResizeHandle } from "./SideToolPanelResizeHandle";
import { MobileMap } from "@mobile-apparatus";
import { useAnimatedSize } from "../useAnimatedSize";

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    component: {
        flex: 1,
    },
    componentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    componentContent: {
        flex: 1,
    },
});

interface Props {
    placement: "left" | "right";
    map?: MobileMap;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const SideToolPanel: FC<Props> = ({
    placement,
    map,
    activeId,
    onActiveIdChange,
}) => {
    const { toolsStation } = useMobileMachineWard();
    const theme = useTheme();
    const [isDragging, setIsDragging] = useState(false);

    const {
        panelMenuLabel,
        swapPlacementLabel,
        show,
        toolPanel,
        currentWidth,
        handleSidePanelActiveIdChange,
    } = useSideToolPanel(placement, activeId, onActiveIdChange);

    const animatedWidth = useAnimatedSize(currentWidth, { animate: !isDragging });

    if (!show) {
        return null;
    }

    return (
        <View
            ref={assignSideToolPanelRef(placement, toolsStation)}
            style={[
                {
                    backgroundColor: theme.componentColor('background', 0.87),
                    shadowColor: theme.componentColor('box-shadow'),
                    shadowOpacity: theme.isDark ? 0.4 : 0.14,
                    shadowRadius: theme.isDark ? 5 : 4,
                    elevation: 8,
                },
                placement === 'right'
                    ? {
                        borderLeftWidth: 1,
                        borderLeftColor: theme.color('neutral'),
                        shadowOffset: { width: -2, height: 0 },
                    }
                    : {
                        borderRightWidth: 1,
                        borderRightColor: theme.color('neutral'),
                        shadowOffset: { width: 2, height: 0 },
                    },
            ]}
        >
            <Animated.View style={{ flex: 1, width: animatedWidth, overflow: 'hidden' }}>
                <View style={styles.content}>
                    <ToolPanelHeader
                        placement={placement}
                        activeId={activeId}
                        onActiveIdChange={handleSidePanelActiveIdChange}
                    />
                    <View style={styles.component}>
                        {toolPanel?.headerComponent ? (
                            <View style={styles.componentHeader}>
                                {toolPanel.headerComponent ? <toolPanel.headerComponent map={map} placement={toolPanel.placement} /> : null}
                                {toolPanel.placement !== 'bottom' ? (
                                    <Menu
                                        tooltip={panelMenuLabel}
                                        tooltipPlacement="bottom"
                                        placement={toolPanel.placement === "right" ? "bottom-right" : "bottom-left"}
                                        iconActiveColor="secondary"
                                        iconSize="xs"
                                    >
                                        <MenuItem key="swap-placement" onPress={swapSideToolPanelPlacement(toolPanel, toolsStation)}>
                                            {swapPlacementLabel}
                                        </MenuItem>
                                    </Menu>
                                ) : null}
                            </View>
                        ) : null}
                        <View style={styles.componentContent}>
                            {toolPanel ? <toolPanel.contentComponent map={map} placement={toolPanel.placement} /> : null}
                        </View>
                    </View>
                </View>
            </Animated.View>
            <SideToolPanelResizeHandle placement={placement} onDraggingChange={setIsDragging} />
        </View>
    );
};
