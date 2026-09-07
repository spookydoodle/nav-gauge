import { FC, useEffect, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import { OverlayComponentProps } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { getRouteSourceData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { emptyCollection, useSubjectState } from "@tinker-chest";
import { updateRouteLayer } from "../tinkers";
import { useLoadedWebImages } from "../hooks";
import { RouteLineLayer } from "./RouteLineLayer";
import { RouteCurrentPointLayer } from "./RouteCurrentPointLayer";
import { WebRouteStoryProps } from "../model";
import { DebugRouteCameraLineLayer } from "./DebugRouteCameraLineLayer";

export const RouteLayer: FC<OverlayComponentProps<maplibregl.Map> & WebRouteStoryProps> = ({
    map,
    animatrix,
    data$,
    splineData$,
    state$,
    routeTimes$,
    images$,
    progressMs$,
    playerOperator,
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [splineData] = useSubjectState(splineData$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [progressMs] = useSubjectState(progressMs$);
    const { chronoLens, individuator } = useWebMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [state] = useSubjectState(state$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const { cameraTilt, cameraZoom, cameraRoll, easeDuration } = animationControls;

    const loadedImages = useLoadedWebImages(images);

    const sources = useMemo((): { [key in 'line' | 'currentPoint']: GeoJSON.GeoJSON } => {
        if (!geojson || !routeTimes) {
            return { currentPoint: emptyCollection, line: emptyCollection };
        }

        return getRouteSourceData(
            state,
            geojson,
            routeTimes.startTimeEpoch,
            progressMs, // Not a dependency of this memo, data is updated later in the animateRoute hook
        );
    }, [geojson, routeTimes, state]);

    useEffect(() => {
        if (!isPlaying || !geojson || !routeTimes) {
            return;
        }
        playerOperator.animateRoute(loadedImages,
            (currentPoint, lines) => {
                updateRouteLayer(map, lines, currentPoint);
            },
            (position, bearing) => {
                map.easeTo({
                    easeId: 'follow-current-point',
                    animate: true,
                    center: new maplibregl.LngLat(position[0], position[1]),
                    essential: true,
                    duration: easeDuration,
                    zoom: cameraZoom,
                    pitch: cameraTilt,
                    bearing,
                    roll: cameraRoll,
                });
            },
        );

        return () => {
            playerOperator.cleanupAnimateRoute();
        };
    }, [isPlaying, loadedImages, easeDuration, cameraZoom, cameraTilt, cameraRoll]);

    return (
        <>
            {settings.debugMode && splineData ? (
                <DebugRouteCameraLineLayer map={map} spline={splineData} />
            ) : null}
            <RouteLineLayer map={map} source={sources.line} state={state} />
            <RouteCurrentPointLayer map={map} source={sources.currentPoint} state={state} />
        </>
    );
};
