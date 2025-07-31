import { useContext } from "react";
import { MapContext } from "./map-context";

export const useMap = () => {
    return useContext(MapContext);
};
