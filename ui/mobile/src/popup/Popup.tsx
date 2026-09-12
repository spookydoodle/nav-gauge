import { FC, useEffect, useRef, useState } from 'react';
import { Animated, HostInstance, Modal, Pressable, StyleSheet, useWindowDimensions, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { MenuPosition, getIconAnchorPoint, menuPositionsMatch, placePopup, PopupProps, Theme, useTheme } from '@ui';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: Theme.zIndex.popup,
    },
    popup: {
        position: 'absolute',
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        elevation: 10,
    },
});

interface Props extends PopupProps {
    modal?: boolean;
    overlayStyle?: StyleProp<ViewStyle>;
    popupStyle?: StyleProp<ViewStyle>;
}

export const Popup: FC<Props> = ({
    anchor,
    position,
    triggerAnchor = 'top-left',
    popupAnchor = 'bottom-left',
    dismissOnClickAway = true,
    visible,
    onClose,
    modal = true,
    overlayStyle,
    popupStyle,
    children,
}) => {
    const theme = useTheme();
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});
    const [popupSize, setPopupSize] = useState<{ width: number; height: number } | null>(null);
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const animValue = useRef(new Animated.Value(0)).current;
    const overlayRef = useRef<HostInstance>(null);

    useEffect(() => {
        if (!visible) {
            return;
        }

        const computePosition = () => {
            if (position) {
                updatePosition(position, windowWidth, windowHeight);
                return;
            }

            const nativeAnchor = anchor?.current as unknown as HostInstance | null;
            if (!nativeAnchor?.measureInWindow || !overlayRef.current) return;

            nativeAnchor.measureInWindow((anchorX, anchorY, anchorWidth, anchorHeight) => {
                overlayRef.current?.measureInWindow((overlayX, overlayY, overlayWidth, overlayHeight) => {
                    updatePosition(
                        getIconAnchorPoint(triggerAnchor, anchorX - overlayX, anchorY - overlayY, anchorWidth, anchorHeight),
                        overlayWidth,
                        overlayHeight,
                    );
                });
            });
        };

        const updatePosition = (iconAnchor: { x: number; y: number }, viewportWidth: number, viewportHeight: number) => {
            const nextPosition = placePopup(
                popupAnchor,
                iconAnchor,
                popupSize,
                viewportWidth,
                viewportHeight,
            ).position;

            setMenuPosition((current) => menuPositionsMatch(current, nextPosition) ? current : nextPosition);
        };

        computePosition();
        const followInterval = setInterval(computePosition, 100);
        return () => clearInterval(followInterval);
    }, [visible, anchor, position, triggerAnchor, popupAnchor, popupSize, windowWidth, windowHeight]);

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setPopupSize({ width, height });
    };

    useEffect(() => {
        if (visible) {
            Animated.timing(animValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                onClose();
            });
        }
    }, [visible]);

    const interpolatedY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: popupAnchor.startsWith('top') ? [-100, 0] : [100, 0],
    });

    const opacity = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const animatedStyle: StyleProp<ViewStyle> = {
        transform: [{ translateY: interpolatedY }],
        opacity: opacity as unknown as number,
    };

    const positionStyle: StyleProp<ViewStyle> = {
        ...(menuPosition.top !== undefined && { top: menuPosition.top }),
        ...(menuPosition.left !== undefined && { left: menuPosition.left }),
        ...(menuPosition.right !== undefined && { right: menuPosition.right }),
        ...(menuPosition.bottom !== undefined && { bottom: menuPosition.bottom }),
    };

    const popup = (
        <Animated.View
            onLayout={handleLayout}
            style={[
                styles.popup,
                {
                    shadowColor: theme.componentColor('box-shadow'),
                    shadowOpacity: theme.isDark ? 0.45 : 0.14,
                },
                positionStyle,
                animatedStyle,
                popupStyle,
            ]}
        >
            <Pressable onPress={(event) => event.stopPropagation()}>{children}</Pressable>
        </Animated.View>
    );

    if (!modal) {
        return <View ref={overlayRef} pointerEvents="box-none" style={[styles.overlay, overlayStyle]}>{popup}</View>;
    }

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
            <Pressable style={[styles.overlay, overlayStyle]} onPress={dismissOnClickAway ? onClose : undefined}>
                {popup}
            </Pressable>
        </Modal>
    );
};
