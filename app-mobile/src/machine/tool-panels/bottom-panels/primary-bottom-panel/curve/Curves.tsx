import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { CurveLeft } from "./CurveLeft";
import { CurveMiddle } from "./CurveMiddle";
import { CurveRight } from "./CurveRight";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    curves: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: "row",
    }
});

export const Curves: FC = () => {
    const theme = useTheme();

    return (
        <View style={[
            styles.curves,
            {
                filter: [{
                    dropShadow: `0 -2px ${theme.isDark ? 4 : 3}px ${theme.componentColor('box-shadow', theme.isDark ? 0.18 : 0.08)}`,
                }],
                shadowColor: theme.componentColor('box-shadow'),
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: theme.isDark ? 0.18 : 0.08,
                shadowRadius: theme.isDark ? 4 : 3,
            },
        ]}>
            <CurveLeft />
            <CurveMiddle />
            <CurveRight />
        </View>
    );
};
