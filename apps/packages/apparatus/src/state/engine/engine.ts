import { BehaviorSubject } from "rxjs";
import { Gear } from "./model";
import { StateWarden } from "../state-warden";

export class Engine {
    public constructor() { }

    public gears$ = new BehaviorSubject<Gear[]>([]);

    public addGear = (gear: Gear) => {
        if (this.gears$.value.some((g) => g.id === gear.id)) {
            throw new Error(`Gear with id: ${gear.id} already exists!`);
        }
        this.gears$.next(this.gears$.value.concat([gear]));
    };

    public removeGear = (id: string) => {
        this.gears$.next(this.gears$.value.filter((g) => g.id !== id));
    };

    public openValves = (gears: Gear[], stateWarden: StateWarden) => {
        for (const gear of gears) {
            gear.engage(stateWarden);
        }
    };

    public closeValves = (gears: Gear[], stateWarden: StateWarden) => {
        for (const gear of gears) {
            gear.disengage(stateWarden);
        }
    };
}
