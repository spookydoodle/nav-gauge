import { FC, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { FieldsetProps } from "@ui";
import { FieldsetHeaderContent } from "./FieldsetHeaderContent";
import { FieldsetBevelOutline } from "./FieldsetBevelOutline";
import { FieldsetHeader } from "./FieldsetHeader";

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        gap: 10,
    }
});

const ANIMATION_DURATION = 250;

const bevelBySize = { xs: 6, sm: 10, md: 20 } as const;

const sizeMap = {
    xs: { fontSize: 11, padding: 6 },
    sm: { fontSize: 12, padding: 10 },
    md: { fontSize: 14, padding: 10 },
} as const;

interface Props extends FieldsetProps {
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
}

export const Fieldset: FC<Props> = ({
    label,
    prepend,
    append,
    size = 'md',
    color,
    variant,
    expandable = true,
    expanded: controlledExpanded,
    onExpandedChange,
    children,
}) => {
    const [internalExpanded, setInternalExpanded] = useState(true);
    const isExpanded = controlledExpanded ?? internalExpanded;

    const contentHeight = useRef(new Animated.Value(0)).current;
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [animating, setAnimating] = useState(false);
    const pendingExpand = useRef(false);

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);

        if (pendingExpand.current) {
            pendingExpand.current = false;
            contentHeight.setValue(height);
            setAnimating(true);
            contentHeight.setValue(0);
            Animated.timing(contentHeight, {
                toValue: height,
                duration: ANIMATION_DURATION,
                useNativeDriver: false,
            }).start(() => setAnimating(false));
        }

        setContainerHeight(height);
    };

    const handleToggle = () => {
        if (isExpanded) {
            contentHeight.stopAnimation();
            setAnimating(true);
            contentHeight.setValue(containerHeight);
            Animated.timing(contentHeight, {
                toValue: 0,
                duration: ANIMATION_DURATION,
                useNativeDriver: false,
            }).start(() => {
                setAnimating(false);
                onExpandedChange?.(false);
                setInternalExpanded(false);
            });
        } else {
            contentHeight.setValue(0);
            onExpandedChange?.(true);
            setInternalExpanded(true);
            pendingExpand.current = true;
        }
    };

    const { fontSize, padding } = sizeMap[size];
    const effectiveBevel = containerWidth > 0
        ? Math.min(bevelBySize[size], containerWidth / 2 - 1)
        : bevelBySize[size];
    return (
        <View style={styles.container} onLayout={handleLayout}>
            <FieldsetBevelOutline
                containerWidth={containerWidth}
                containerHeight={containerHeight}
                bevel={effectiveBevel}
                color={color}
                variant={variant}
            />
            <Animated.View
                style={animating
                    ? { height: contentHeight, overflow: 'hidden' }
                    : undefined
                }
            >
                <View style={{ paddingLeft: effectiveBevel, paddingRight: effectiveBevel, padding }}>
                    <FieldsetHeader expandable={expandable} onToggle={handleToggle}>
                        <FieldsetHeaderContent
                            label={label}
                            expandable={expandable}
                            isExpanded={isExpanded}
                            prepend={prepend}
                            append={append}
                            fontSize={fontSize}
                        />
                    </FieldsetHeader>
                    {(!expandable || isExpanded) ? (
                        <View style={styles.content}>
                            {children}
                        </View>
                    ) : null}
                </View>
            </Animated.View>
        </View>
    );
};
