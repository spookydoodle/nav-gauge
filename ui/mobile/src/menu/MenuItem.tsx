import { FC } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Text } from '../typography';
import { MenuItemProps, useMenuClose, useTheme } from '@ui';

const styles = StyleSheet.create({
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 16,
    },
});

export const MenuItem: FC<{ onPress: () => void; } & MenuItemProps> = ({
    highlightColor = 'neutral',
    onPress,
    disabled,
    children,
}) => {
    const theme = useTheme();
    const handleClose = useMenuClose();

    return (
        <TouchableHighlight
            underlayColor={theme.color(highlightColor, theme.isLight ? 300 : 600)}
            style={styles.menuItem}
            onPress={() => {
                onPress();
                handleClose();
            }}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
        >
            <Text style={styles.menuText}>
                {children}
            </Text>
        </TouchableHighlight>
    );
};
