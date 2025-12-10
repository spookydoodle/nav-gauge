import { FC, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import {
    RouteTimes,
    GeoJson,
    ImageData,
    LoadedImageData,
    clearLayersAndSources,
    currentPointLayers,
    getRouteSourceData,
    layerIds,
    routeLineLayer,
    routePointsLayer,
    sourceIds,
    updateRouteLayer
} from "../../logic";
import { useStateWarden, useGaugeContext } from "../../contexts";
import { useSubjectState } from "../../hooks";

interface Props {
    isPlaying: boolean;
    geojson: GeoJson;
    routeTimes: RouteTimes;
    progressMs: number;
    onProgressMsChange: React.Dispatch<React.SetStateAction<number>>;
    images: ImageData[];
}

export const RouteLayer: FC<Props> = ({
    isPlaying,
    geojson,
    routeTimes,
    progressMs,
    onProgressMsChange,
    images,
}) => {
    const { cartomancer: { map }, animatrix } = useStateWarden();
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
        progress === 100 && image.data && image.lngLat && image.featureId !== undefined && !error
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
            clearLayersAndSources(
                map,
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
        let lastImageShownFeatureId: number | undefined;
        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        const sortedImageFeatures = loadedImages.toSorted((a, b) => b.featureId - a.featureId);
        let last = performance.now();
        let current = progressMs;

        // TODO: Move to animatrix
        const animate = () => {
            const now = performance.now();
            const dt = now - last;
            last = now;
            current += dt + speedMultiplier;
            if (startTimeEpoch + current >= endTimeEpoch) {
                current = 0;
            }
            const { currentPoint, currentPointBearing } = updateRouteLayer(map, geojson, startTimeEpoch, current, bearingLineLengthInMeters);
            const currentPointImage = sortedImageFeatures.find((f) => f.featureId === currentPoint.id);

            if (currentPointImage && animation !== undefined && lastImageShownFeatureId !== currentPointImage.featureId) {
                animatrix.displayImageId$.next(currentPointImage.id);
                lastImageShownFeatureId = currentPointImage.featureId;
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
            lastImageShownFeatureId = undefined;
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
