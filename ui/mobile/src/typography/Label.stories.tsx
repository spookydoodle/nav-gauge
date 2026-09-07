import { FC } from "react";
import { View } from "react-native";
import { Label } from "./Label";

export const LabelVariants: FC = () => (
    <View style={{ rowGap: 12 }}>
        <Label>Default label</Label>
        <Label color="primary">Primary label</Label>
        <Label color="secondary">Secondary label</Label>
    </View>
);