import { View, StyleSheet } from 'react-native';
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { Text } from "../typography";

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 'auto',
    },
});

const colors = ['primary', 'secondary', 'tertiary', 'neutral'] as const;

export const MenuColors = () => (
    <View>
        {colors.map((color) => (
            <View key={color}>
                <Text>color="{color}"</Text>
                <View style={styles.wrapper}>
                    <Menu color={color}>
                        <MenuItem key={1} onPress={() => console.info("Option 1")}>Option 1</MenuItem>
                        <MenuItem key={2} onPress={() => console.info("Option 2")}>Option 2</MenuItem>
                    </Menu>
                </View>
            </View>
        ))}
    </View>
);

export const MenuPlacements = () => (
    <View>
        <Text>Requested placements flip automatically when a menu would overflow the viewport.</Text>
        <View>
            <Text>placement="bottom-right" (default)</Text>
            <View style={styles.wrapper}>
                <Menu placement="bottom-right">
                    <MenuItem key={1} onPress={() => console.info("Option 1")}>Option 1</MenuItem>
                    <MenuItem key={2} onPress={() => console.info("Option 2")} >Option 2</MenuItem>
                </Menu>
            </View>
        </View>

        <View>
            <Text>placement="bottom-left"</Text>
            <View style={styles.wrapper}>
                <Menu placement="bottom-left">
                    <MenuItem key={1} onPress={() => console.info("Option A")}>Option 1</MenuItem>
                    <MenuItem key={2} onPress={() => console.info("Option B")} >Option 2</MenuItem>
                </Menu>
            </View>
        </View>

        <View>
            <Text>placement="top-right"</Text>
            <View style={styles.wrapper}>
                <Menu placement="top-right">
                    <MenuItem key={1} onPress={() => console.info("Option X")} >Option 1</MenuItem>
                    <MenuItem key={2} onPress={() => console.info("Option Y")}>Option 2</MenuItem>
                </Menu>
            </View>
        </View>

        <View>
            <Text>placement="top-left"</Text>
            <View style={styles.wrapper}>
                <Menu placement="top-left">
                    <MenuItem key={1} onPress={() => console.info("Option 1")} >Option 1</MenuItem>
                    <MenuItem key={2} onPress={() => console.info("Option 2")} >Option 2</MenuItem>
                    <MenuItem key={3} onPress={() => console.info("Option 3")} >Option 3</MenuItem>
                    <MenuItem key={4} onPress={() => console.info("Option 4")} >Option 4</MenuItem>
                    <MenuItem key={5} onPress={() => console.info("Option 5")} >Option 5</MenuItem>
                </Menu>
            </View>
        </View>
    </View>
);
