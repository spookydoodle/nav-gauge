import { FC, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { assignBottomToolPanelRef, useBottomToolPanel } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { BottomToolPanelHeader } from "./BottomToolPanelHeader";
import { MobileMap } from "@mobile-apparatus";
import { useTheme } from "@ui";
import { useAnimatedSize } from "../../useAnimatedSize";

const styles = StyleSheet.create({
    componentHeader: {
        flexDirection: 'row',
        paddingHorizontal: 8,
    },
    measuredContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
});

interface Props {
    map?: MobileMap;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
    joinHeaderButtons?: boolean;
}

export const BottomToolPanel: FC<Props> = ({
    map,
    activeId,
    onActiveIdChange,
    joinHeaderButtons,
}) => {
    const theme = useTheme();
    const { toolsStation } = useMobileMachineWard();
    const { show, toolPanel } = useBottomToolPanel(activeId);

    const [naturalHeight, setNaturalHeight] = useState(0);
    const animatedHeight = useAnimatedSize(toolPanel !== undefined ? naturalHeight : 0);

    if (!show) {
        return null;
    }

    return (
        <View ref={assignBottomToolPanelRef(toolsStation)}>
            <View style={[{
                backgroundColor: theme.componentColor('background', 0.87),
                borderTopColor: theme.color('primary'),
                shadowColor: theme.componentColor('box-shadow'),
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: theme.isDark ? 0.2 : 0.08,
                shadowRadius: theme.isDark ? 5 : 4,
                elevation: 4,
            }]}>
                <BottomToolPanelHeader
                    activeId={activeId}
                    onActiveIdChange={onActiveIdChange}
                    joinHeaderButtons={joinHeaderButtons}
                />
                <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
                    <View
                        style={styles.measuredContent}
                        onLayout={(event) => {
                            if (toolPanel) {
                                setNaturalHeight(event.nativeEvent.layout.height);
                            }
                        }}
                    >
                        {toolPanel ? (
                            <>
                                {toolPanel.headerComponent ? (
                                    <View style={styles.componentHeader}>
                                        <toolPanel.headerComponent map={map} placement={toolPanel.placement} />
                                    </View>
                                ) : null}
                                <View>
                                    <toolPanel.contentComponent map={map} placement={toolPanel.placement} />
                                </View>
                            </>
                        ) : null}
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};
