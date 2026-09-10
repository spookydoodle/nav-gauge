import { FC, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSecondaryBottomToolPanel } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useTheme } from "@ui";
import { ToolPanelHeader } from "../../panel-header/ToolPanelHeader";
import { BottomSecondaryToolPanelResizeHandle } from "./SecondaryBottomToolPanelResizeHandle";
import { MobileMap } from "@mobile-apparatus";
import { useAnimatedSize } from "../../useAnimatedSize";

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    component: {
        flex: 1,
    },
    componentContent: {
        flex: 1,
    },
});

interface Props {
    map?: MobileMap;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const SecondaryBottomToolPanel: FC<Props> = ({
    map,
    activeId,
    onActiveIdChange,
}) => {
    const theme = useTheme();
    const { toolsStation } = useMobileMachineWard();
    const [isDragging, setIsDragging] = useState(false);

    const {
        show,
        effectiveHeight,
        toolPanel,
        handleToolSelect,
    } = useSecondaryBottomToolPanel(activeId, onActiveIdChange);

    const animatedHeight = useAnimatedSize(effectiveHeight, { animate: !isDragging });

    if (!show) {
        return null;
    }

    return (
        <View
            ref={(instance) => {
                toolsStation.bottomSecondaryToolPanelSizeRef.current = instance;
            }}
            style={styles.container}>
            <Animated.View
                style={{
                    height: animatedHeight,
                    backgroundColor: theme.componentColor('background', 0.87),
                    borderTopWidth: 1,
                    borderTopColor: theme.color('primary'),
                    shadowColor: theme.componentColor('box-shadow'),
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: theme.isDark ? 0.24 : 0.1,
                    shadowRadius: theme.isDark ? 5 : 4,
                    elevation: 5,
                }}
            >
                <ToolPanelHeader
                    placement="bottom"
                    activeId={activeId}
                    onActiveIdChange={handleToolSelect}
                    headerControls={toolPanel?.headerComponent ? (
                        <toolPanel.headerComponent map={map} placement={toolPanel.placement} />
                    ) : undefined}
                />
                {toolPanel ? (
                    <View style={styles.component}>
                        <View style={styles.componentContent}>
                            <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                        </View>
                    </View>
                ) : null}
            </Animated.View>
            <BottomSecondaryToolPanelResizeHandle onDraggingChange={setIsDragging} />
        </View>
    );
};
