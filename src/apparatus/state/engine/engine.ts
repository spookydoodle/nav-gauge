import { BehaviorSubject } from "rxjs";
import { Gear } from "./model";
import { StateWarden } from "../state-warden";

export class Engine {
    public constructor() {}
    
    public gears$ = new BehaviorSubject<Gear[]>([]);

    public openValves = (stateWarden: StateWarden) => {
        for (const gear of this.gears$.value) {
            gear.engage(stateWarden);
        }
    };

    public closeValves = (stateWarden: StateWarden) => {
        for (const gear of this.gears$.value) {
            gear.disengage(stateWarden);
        }
    };
}
