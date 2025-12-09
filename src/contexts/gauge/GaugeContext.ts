import { createContext, } from "react";
import {
    AnimationControlsType,
    ApplicationSettingsType,
    defaultApplicationSettings,
    defaultGaugeControls,
    defaultMapLayout,
    GaugeControlsType,
    MapLayout
} from "../../logic";
import { Animatrix } from "../../logic/state/animatrix";

export type GaugeContext = GaugeControlsType & MapLayout & AnimationControlsType & ApplicationSettingsType;

export const GaugeContext = createContext<GaugeContext>({
    ...defaultGaugeControls,
    ...defaultMapLayout,
    ...Animatrix.defaultControls,
    ...defaultApplicationSettings
});
