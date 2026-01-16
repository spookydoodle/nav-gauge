import { StateWarden } from "../state-warden";

export interface Gear {
    id: string;
    engage: (stateWarden: StateWarden) => void;
    disengage: (stateWarden: StateWarden) => void;
}
