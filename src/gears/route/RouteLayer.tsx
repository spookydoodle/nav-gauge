import { FC, useEffect, useMemo } from "react";
import maplibregl from "maplibre-gl";
import {
    OverlayComponentProps,
    LoadedImageData,
    useStateWarden,
    useGaugeContext,
    useSubjectState,
    useMapLayerData,
    MapLayerData
} from "@apparatus";
import { getRouteSourceData, updateRouteLayer } from "./tinkers";
import { currentPointLayers, routeLineLayer, getRoutePointsLayer, sourceIds } from "./layers";
import { useLoadedImages } from "./hooks/useLoadedImages";

export const RouteLayer: FC<OverlayComponentProps> = ({
    geojson,
    routeTimes,
    progressMs,
    onProgressMsChange,
    images,
}) => {
    const { cartomancer, animatrix, chronoLens } = useStateWarden();
    const { map } = cartomancer;
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const { showRouteLine, showRoutePoints } = useGaugeContext();
    const {
        followCurrentPoint,
        cameraAngle,
        autoRotate,
        pitch,
        zoom,
        zoomInToImages,
        displayImageDuration,
        cameraRoll,
        speedMultiplier,
        easeDuration,
        bearingLineLengthInMeters,
        maxBearingDiffPerFrame,
    } = animationControls;

    const loadedImages = useLoadedImages(images);

    const mapLayerData = useMemo((): MapLayerData => {
        const { currentPoint, lines } = getRouteSourceData(
            geojson,
            routeTimes.startTimeEpoch,
            progressMs,
            bearingLineLengthInMeters
        );

        const layers: MapLayerData['layers'] = [];
        if (showRouteLine) {
            layers.push(routeLineLayer);
        }
        if (showRoutePoints) {
            layers.push(getRoutePointsLayer());
        }
        layers.push(...currentPointLayers);

        return {
            sources: {
                [sourceIds.line]: {
                    type: 'geojson',
                    data: showRouteLine || showRoutePoints
                        ? lines
                        : { type: 'FeatureCollection', features: [] },
                    promoteId: 'id'
                },
                [sourceIds.currentPoint]: {
                    type: 'geojson',
                    data: currentPoint,
                }
            },
            layers,
        };
    }, [geojson, routeTimes.startTimeEpoch, bearingLineLengthInMeters, showRouteLine, showRoutePoints]);

    useMapLayerData(mapLayerData)

    useEffect(() => {
        if (!isPlaying) {
            return;
        }
        let animation: number | undefined;
        let displayImageTimeout: NodeJS.Timeout | undefined;
        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        const sortedImageFeatures = loadedImages.toSorted((a, b) => a.featureId - b.featureId);
        let last = performance.now();
        let current = progressMs;
        let nextImageIndex = sortedImageFeatures.findIndex((imageFeature): boolean => {
            const f = geojson.features.find((feature) => feature.properties.id === imageFeature.featureId);
            return !!f && new Date(f.properties.time).valueOf() >= new Date(startTimeEpoch + progressMs).valueOf();
        });

        // TODO: Move to animatrix
        const animate = () => {
            const now = performance.now();
            const dt = now - last;
            last = now;
            current += dt + speedMultiplier;
            if (startTimeEpoch + current >= endTimeEpoch) {
                current = 0;
                nextImageIndex = 0;
            }
            const nextImage: LoadedImageData | undefined = sortedImageFeatures[nextImageIndex];
            const { currentPoint, currentPointBearing } = updateRouteLayer(map, geojson, startTimeEpoch, current, bearingLineLengthInMeters, nextImage?.featureId);

            if (animation !== undefined && nextImage && nextImage.featureId <= Number(currentPoint.id)) {
                animatrix.displayImageId$.next(nextImage.id);
                nextImageIndex = nextImageIndex + 1;
                cancelAnimationFrame(animation);
                displayImageTimeout = setTimeout(() => {
                    animatrix.displayImageId$.next(null);
                    animation = requestAnimationFrame(animate);
                }, displayImageDuration);

                return;
            }

            if (followCurrentPoint) {
                const lngLat = new maplibregl.LngLat(currentPoint.geometry.coordinates[0], currentPoint.geometry.coordinates[1]);
                const currentBearing = map.getBearing();
                const nextBearing = (cameraAngle + (autoRotate ? currentPointBearing : 0));
                const bearingDiff = ((nextBearing - currentBearing + 540) % 360) - 180;

                map.easeTo({
                    easeId: 'follow-current-point',
                    animate: true,
                    center: lngLat,
                    essential: true,
                    duration: easeDuration,
                    zoom,
                    pitch,
                    bearing: currentBearing + Math.max(-maxBearingDiffPerFrame, Math.min(maxBearingDiffPerFrame, bearingDiff)),
                    roll: cameraRoll,
                });
            }

            // TODO: Calculate % of geometry done based on current progressMs and update paint property line gradient instead of all data.
            onProgressMsChange(current);
            animation = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            clearTimeout(displayImageTimeout);
            animatrix.displayImageId$.next(null);
            if (animation !== undefined) {
                cancelAnimationFrame(animation);
            }
        };
    }, [
        isPlaying,
        followCurrentPoint,
        cameraAngle,
        cameraRoll,
        autoRotate,
        pitch,
        zoom,
        zoomInToImages,
        speedMultiplier,
        easeDuration,
        bearingLineLengthInMeters,
        maxBearingDiffPerFrame,
        displayImageDuration,
        loadedImages,
    ]);

    return null;
};
