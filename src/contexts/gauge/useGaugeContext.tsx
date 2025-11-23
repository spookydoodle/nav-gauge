import { useContext } from "react";
import { GaugeContext } from "./GaugeContext";

export const useGaugeContext = () => {
    return useContext(GaugeContext);
};
