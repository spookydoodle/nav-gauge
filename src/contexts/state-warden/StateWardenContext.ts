import { createContext, } from "react";
import { StateWarden } from "../../apparatus";

export const theOneAndOnlyStateWarden: StateWarden = new StateWarden();

export const StateWardenContext = createContext<StateWarden>(theOneAndOnlyStateWarden);
