import { useContext } from "react";
import { StateWardenContext } from "./StateWardenContext";

export const useStateWarden = () => {
    return useContext(StateWardenContext);
};
