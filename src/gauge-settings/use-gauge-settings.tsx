import { useContext } from "react";
import { GaugeContext } from "./gauge-settings";

export const useGaugeSettings = () => {
    return useContext(GaugeContext);
};
