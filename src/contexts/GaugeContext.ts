import { createContext, } from "react";
import { AnimationControlsType, ApplicationSettingsType, defaultAnimationControls, defaultApplicationSettings, defaultGaugeControls, defaultMapLayout, GaugeControlsType, MapLayout } from "../logic";

export type GaugeContext = GaugeControlsType & MapLayout & AnimationControlsType & ApplicationSettingsType;

export const GaugeContext = createContext<GaugeContext>({
    ...defaultGaugeControls,
    ...defaultMapLayout,
    ...defaultAnimationControls,
    ...defaultApplicationSettings
});
