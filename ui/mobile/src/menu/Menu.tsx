import { useState, useRef, FC, ComponentProps } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Pressable,
    LayoutChangeEvent,
    useWindowDimensions,
    type HostInstance,
} from 'react-native';
import {
    useTheme,
    MenuPosition,
    getIconAndMenuAnchors,
    MenuContext,
    getIconAnchorPoint,
    placePopup,
    MenuProps,
    Icons,
} from '@ui';
import { Button } from '../button';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
    },
    menuList: {
        position: 'absolute',
        paddingVertical: 8,
        minWidth: 160,
        elevation: 10,
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 0.6,
        shadowRadius: 1,
        borderWidth: 2,
    }
});

export const Menu: FC<MenuProps> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    iconSize,
    placement = 'bottom-right',
    color = 'neutral',
    children,
}) => {
    const { icon: iconAnchor, menu: menuAnchor } = getIconAndMenuAnchors(placement);
    const theme = useTheme();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const [visible, setVisible] = useState<boolean>(false);
    const [anchorPoint, setAnchorPoint] = useState<{ x: number; y: number } | null>(null);
    const [menuSize, setMenuSize] = useState<{ width: number; height: number } | null>(null);

    const iconWrapperRef = useRef<HostInstance>(null);

    const toggleMenu = (): void => {
        if (visible) {
            setVisible(false);
            return;
        }
        iconWrapperRef.current?.measureInWindow((x, y, width, height) => {
            setAnchorPoint(getIconAnchorPoint(iconAnchor, x, y, width, height));
            setVisible(true);
        });
    };

    const handleMenuLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setMenuSize({ width, height });
    };
    const menuPosition: MenuPosition = anchorPoint
        ? placePopup(menuAnchor, anchorPoint, menuSize, windowWidth, windowHeight).position
        : {};

    return (
        <View style={styles.container}>
            <View ref={iconWrapperRef}>
                <Button
                    icon={icon as ComponentProps<typeof Button>['icon']}
                    color={color}
                    highlightColor={iconActiveColor}
                    size={iconSize}
                    active={visible}
                    onPress={toggleMenu}
                    style={styles.iconButton}
                />
            </View>

            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
            >
                <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
                    <View
                        onLayout={handleMenuLayout}
                        style={[
                            styles.menuList,
                            {
                                ...menuPosition,
                                backgroundColor:theme.color(color, theme.isDark ? 700 : 200),
                                borderColor: theme.color(color, theme.isDark ? 500 : 400),
                                shadowColor: theme.componentColor('box-shadow'),
                            }
                        ]}
                    >
                        <MenuContext.Provider value={{ onClose: () => setVisible(false) }}>
                            {children}
                        </MenuContext.Provider>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};
