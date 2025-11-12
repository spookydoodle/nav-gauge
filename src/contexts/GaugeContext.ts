import { createContext, } from "react";
import { defaultMapLayout, MapLayout } from "../nav-gauge/controls/MapLayoutControls";
import { defaultGaugeControls, GaugeControlsType } from "../logic";

export type GaugeContext = GaugeControlsType & MapLayout;

export const GaugeContext = createContext<GaugeContext>({
    ...defaultGaugeControls,
    ...defaultMapLayout,
});
