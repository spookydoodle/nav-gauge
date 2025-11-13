import { createContext, } from "react";
import { ApplicationSettingsType, defaultApplicationSettings, defaultGaugeControls, defaultMapLayout, GaugeControlsType, MapLayout } from "../logic";

export type GaugeContext = GaugeControlsType & MapLayout & ApplicationSettingsType;

export const GaugeContext = createContext<GaugeContext>({
    ...defaultGaugeControls,
    ...defaultMapLayout,
    ...defaultApplicationSettings
});
