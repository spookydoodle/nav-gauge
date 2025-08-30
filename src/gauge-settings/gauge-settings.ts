import { createContext, } from "react";
import { defaultGaugeControls, GaugeControls } from "../nav-gauge/GaugeControls";
import { defaultMapLayout, MapLayout } from "../nav-gauge/MapLayoutControls";

export type GaugeContext = GaugeControls & MapLayout;

export const GaugeContext = createContext<GaugeContext>({
    ...defaultGaugeControls,
    ...defaultMapLayout,
});
