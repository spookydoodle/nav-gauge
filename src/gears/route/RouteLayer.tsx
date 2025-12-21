import { FC, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { OverlayComponentProps, LoadedImageData } from "../../apparatus";
import { useStateWarden, useGaugeContext } from "../../contexts";
import { useSubjectState } from "../../hooks";
import { currentPointLayers, getRouteSourceData, layerIds, routeLineLayer, routePointsLayer, sourceIds, updateRouteLayer } from "./tinkers";

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
    const [isLayerAdded, setIsLayerAdded] = useState(false);

    const loadedImages: LoadedImageData[] = images.filter(({ progress, error, ...image }) =>
        progress === 100 && image.data && image.featureId !== undefined
    ) as LoadedImageData[];

    useEffect(() => {
        const { currentPoint, lines } = getRouteSourceData(geojson, routeTimes.startTimeEpoch, progressMs, bearingLineLengthInMeters);
        if (showRouteLine || showRoutePoints) {
            map.addSource(sourceIds.line, {
                type: 'geojson',
                data: lines,
                promoteId: 'id'
            });
        }

        map.addSource(sourceIds.currentPoint, {
            type: 'geojson',
            data: currentPoint,
        });

        if (showRouteLine) {
            map.addLayer(routeLineLayer);
        }

        if (showRoutePoints) {
            map.addLayer(routePointsLayer);
        }

        currentPointLayers.forEach((layer) => map.addLayer(layer));

        setIsLayerAdded(true);
        return () => {
            setIsLayerAdded(false);
            cartomancer.clearLayersAndSources(
                [layerIds.line, layerIds.points, layerIds.currentPointOutline, layerIds.currentPoint],
                [sourceIds.line, sourceIds.currentPoint]
            );
        };
    }, [map, geojson, showRouteLine, showRoutePoints, bearingLineLengthInMeters]);

    useEffect(() => {
        if (!isPlaying || !isLayerAdded) {
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
        isLayerAdded,
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
