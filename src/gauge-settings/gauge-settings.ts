import { createContext, } from "react";
import { defaultGaugeControls, GaugeControls } from "../nav-gauge/controls/GaugeControls";
import { defaultMapLayout, MapLayout } from "../nav-gauge/controls/MapLayoutControls";

export type GaugeContext = GaugeControls & MapLayout;

export const GaugeContext = createContext<GaugeContext>({
    ...defaultGaugeControls,
    ...defaultMapLayout,
});
