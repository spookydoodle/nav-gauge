import { createContext, } from "react";
import { StateWarden } from "./state-warden";

export const theOneAndOnlyStateWarden: StateWarden = new StateWarden();

export const StateWardenContext = createContext<StateWarden>(theOneAndOnlyStateWarden);
