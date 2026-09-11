import { FC, useRef, useState } from "react";
import { Dimensions, HostInstance, Modal, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "@apparatus";
import { getIconAnchorPoint, getMenuPosition, MenuPosition, useTheme } from "@ui";
import { ColorPicker, Label } from "@mobile-ui";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";

interface Props {
    disabled?: boolean;
    label?: string;
    value: string;
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    onChange: (color: string) => void;
}

export const ColorSelectField: FC<Props> = ({ disabled = false, label, value, gearId, translationKey, onChange }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<MenuPosition>({});
    const swatchRef = useRef<HostInstance>(null);
    const opacityLabel = useTranslation({ n: gearId, t: translationKey.Opacity });

    const handleOpen = () => {
        swatchRef.current?.measureInWindow((x, y, width, height) => {
            const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
            const point = getIconAnchorPoint('bottom-left', x, y, width, height);
            setPosition(getMenuPosition('top-left', point, windowWidth, windowHeight));
        });
        setOpen(true);
    };

    return (
        <>
            <View style={styles.field}>
                <Pressable
                    ref={swatchRef}
                    style={[styles.swatch, disabled && styles.disabled, {
                        backgroundColor: value,
                        borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                    }]}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityState={{ disabled, expanded: open }}
                    disabled={disabled}
                    onPress={handleOpen}
                />
                {label ? <Label>{label}</Label> : null}
            </View>
            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
                    <Pressable style={[styles.modalPanel, position, {
                        backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                        borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                    }]} onPress={() => {}}>
                        <ColorPicker label={label} value={value} opacityLabel={opacityLabel} onChange={onChange} />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    swatch: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1,
    },
    disabled: {
        opacity: 0.5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalPanel: {
        position: 'absolute',
        width: 260,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
});
