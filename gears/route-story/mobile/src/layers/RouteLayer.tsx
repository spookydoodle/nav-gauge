import { FC, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import { OverlayComponentProps } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { getRouteSourceData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMap } from "@mobile-apparatus";
import { emptyCollection, useSubjectState } from "@tinker-chest";
import { useLoadedMobileImages } from "../images/useLoadedMobileImages";
import { RouteLineLayer } from "./RouteLineLayer";
import { RouteCurrentPointLayer } from "./RouteCurrentPointLayer";
import { DebugRouteCameraLineLayer } from "./DebugRouteCameraLineLayer";
import { MobileRouteStoryProps } from "../model";

export const currentPointRef$ = new BehaviorSubject<GeoJSON.GeoJSON>(emptyCollection);
export const linesRef$ = new BehaviorSubject<GeoJSON.GeoJSON>(emptyCollection);

export const RouteLayer: FC<OverlayComponentProps<MobileMap> & MobileRouteStoryProps> = ({
    map,
    animatrix,
    data$,
    splineData$,
    state$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [splineData] = useSubjectState(splineData$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [progressMs] = useSubjectState(progressMs$);
    const { chronoLens, individuator } = useMobileMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [state] = useSubjectState(state$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const {
        cameraTilt,
        cameraZoom,
        easeDuration,
    } = animationControls;
    const [currentPointSourceData, setCurrentPointSourceData] = useSubjectState(currentPointRef$);
    const [lineSourceData, setLineSourceData] = useSubjectState(linesRef$);

    useEffect(() => {
        // lineRef$.next();
        // currentPointRef$.next();

        return () => {
            setLineSourceData(emptyCollection);
            setCurrentPointSourceData(emptyCollection);
        };
    }, []);

    const loadedImages = useLoadedMobileImages(images);

    useEffect(() => {
        if (!geojson || !routeTimes) {
            setLineSourceData(emptyCollection);
            setCurrentPointSourceData(emptyCollection);
            return;
        }

        const { line, currentPoint } = getRouteSourceData(
            state,
            geojson,
            routeTimes.startTimeEpoch,
            progressMs, // Not a dependency of this memo, data is updated later in the animateRoute hook
        );

        setLineSourceData(line);
        setCurrentPointSourceData(currentPoint);
    }, [geojson, routeTimes?.startTimeEpoch, state]);

    useEffect(() => {
        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        playerOperator.animateRoute(loadedImages,
            (currentPoint, lines) => {
                setLineSourceData(lines);
                setCurrentPointSourceData(currentPoint);
            },
            (position, bearing) => {
                map.camera$.value?.easeTo({
                    center: [position[0], position[1]],
                    duration: easeDuration,
                    zoom: cameraZoom,
                    pitch: cameraTilt,
                    bearing,
                });
            },
        );

        return () => {
            playerOperator.cleanupAnimateRoute();
        };
    }, [isPlaying, loadedImages, easeDuration, cameraZoom, cameraTilt]);

    return (
        <>
            {settings.debugMode && splineData ? <DebugRouteCameraLineLayer spline={splineData} /> : null}
            <RouteLineLayer source={lineSourceData} state={state} />
            <RouteCurrentPointLayer source={currentPointSourceData} state={state} />
        </>
    );
};
