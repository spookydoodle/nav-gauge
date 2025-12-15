import { ComponentType, Dispatch, SetStateAction } from "react";
import { RouteTimes } from "../../../tinker-chest";
import { GeoJson, MarkerImage } from "../../parsers";

export interface Overlay {
    id: string;
    component: ComponentType<OverlayComponentProps>;
}

export interface OverlayComponentProps {
    geojson: GeoJson;
    images: MarkerImage[];
    routeTimes: RouteTimes;
    isPlaying: boolean;
    progressMs: number;
    onProgressMsChange: Dispatch<SetStateAction<number>>;
    onUpdateImageFeatureId: (imageId: number, featureId: number) => void;
}
