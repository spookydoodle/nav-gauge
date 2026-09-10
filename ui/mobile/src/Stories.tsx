import { FC, ComponentType, useState } from "react";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "./typography";
import { useTheme } from "@ui";
import Svg, { Defs, Pattern, Rect } from "react-native-svg";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    detail: {
        rowGap: 40,
    },
    backText: {
        fontWeight: 700,
        fontSize: 16
    },
    back: {
        paddingVertical: 12,
    },
    componentName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12
    },
    list: {
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    heading: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20
    },
    item: {
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    itemText: {
        fontSize: 16

    },
    background: {
        flex: 1,
    },
    pattern: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
});

interface StoryEntry {
    label: string;
    components: {
        label: string;
        Component: ComponentType;
    }[];
}

function discoverStories(): StoryEntry[] {
    const entries: StoryEntry[] = [];
    const context = require.context("./", true, /\.stories\.tsx$/);

    context.keys().forEach((key: string) => {
        const mod = context(key) as Record<string, unknown>;

        entries.push({
            label: key.replace(/^\.\//, "").replace(/\.stories\.tsx$/, ""),
            components: Object.keys(mod).map((exportName) => ({
                label: exportName,
                Component: mod[exportName] as ComponentType,
            })),
        });
    });

    return entries;
}

const stories = discoverStories();

const StoryBackground: FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();

    return (
        <View style={[styles.background, { backgroundColor: theme.componentColor('background') }]}>
            <Svg style={styles.pattern} width="100%" height="100%" pointerEvents="none" accessibilityElementsHidden>
                <Defs>
                    <Pattern id="story-stripes" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <Rect x="8" width="20" height="64" fill={theme.componentColor('text', 0.09)} />
                    </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#story-stripes)" />
            </Svg>
            {children}
        </View>
    );
};

export const Stories: FC = () => {
    const theme = useTheme();
    const [selected, setSelected] = useState<StoryEntry | null>(null);

    if (selected) {
        return (
            <StoryBackground>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => setSelected(null)} style={styles.back}>
                        <Text style={[styles.backText, { color: theme.color('blue', 400) }]}>{"< Back"}</Text>
                    </TouchableOpacity>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.detail}>
                        {selected.components.map(({ label, Component }) => (
                            <View key={label}>
                                <Text style={styles.componentName}>{label}</Text>
                                <Component />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </StoryBackground>
        );
    }

    return (
        <StoryBackground>
            <ScrollView contentContainerStyle={styles.list}>
                <Text style={styles.heading}>UI Components</Text>
                {stories.map((entry) => (
                    <TouchableOpacity
                        key={entry.label}
                        onPress={() => setSelected(entry)}
                        style={[styles.item, {
                            borderBottomColor: theme.componentColor('border'),
                        }]}
                    >
                        <Text style={styles.itemText}>{entry.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </StoryBackground>
    );
};
