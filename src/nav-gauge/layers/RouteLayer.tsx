import { FC, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { RouteTimes, GeoJson, ImageData } from "../../logic";
import { clearLayersAndSources, currentPointLayers, getImagesSourceData, getRouteSourceData, imagesLayer, layerIds, routeLineLayer, routePointsLayer, sourceIds, updateRouteLayer } from "../../logic/map-layers";
import { useGaugeContext } from "../../contexts/gauge/useGaugeContext";
import { useStateWarden } from "../../contexts";

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
    const { cartographer: { map } } = useStateWarden();
    const {
        showRouteLine,
        showRoutePoints,
        followCurrentPoint,
        cameraAngle,
        autoRotate,
        pitch,
        zoom,
        zoomInToImages,
        imagePauseDuration,
        cameraRoll,
        speedMultiplier,
        easeDuration
    } = useGaugeContext();
    const [isLayerAdded, setIsLayerAdded] = useState(false);

    useEffect(() => {
        const { currentPoint, lines } = getRouteSourceData(geojson, routeTimes.startTimeEpoch, progressMs);
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
    }, [map, geojson, showRouteLine, showRoutePoints]);

    useEffect(() => {
        const loadedImages = images.filter((image) => image.progress === 100 && image.data && image.lngLat && image.featureId !== undefined && !image.error);

        if (loadedImages.length === 0) {
            return;
        }

        map.addSource(sourceIds.image, {
            type: 'geojson',
            data: getImagesSourceData(geojson, loadedImages)
        });

        map.addLayer(imagesLayer);

        return () => {
            clearLayersAndSources(
                map,
                [layerIds.images],
                [sourceIds.image]
            );
        };
    }, [map, images]);

    useEffect(() => {
        if (!isPlaying || !isLayerAdded) {
            return;
        }
        let animation: number | undefined;
        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        let last = performance.now();
        let current = progressMs;

        const animate = () => {
            const now = performance.now();
            const dt = now - last;
            last = now;
            current += dt + speedMultiplier;
            if (startTimeEpoch + current >= endTimeEpoch) {
                current = 0;
            }
            const { currentPoint, currentPointBearing } = updateRouteLayer(map, geojson, startTimeEpoch, current);

            if (followCurrentPoint) {
                const lngLat = new maplibregl.LngLat(currentPoint.geometry.coordinates[0], currentPoint.geometry.coordinates[1]);
                const currentBearing = map.getBearing();
                const nextBearing = (cameraAngle + (autoRotate ? (currentPointBearing) : 0));
                const bearingDiff = ((nextBearing - currentBearing + 540) % 360) - 180;
                const maxDiff = 5;

                map.easeTo({
                    easeId: 'follow-current-point',
                    animate: true,
                    center: lngLat,
                    essential: true,
                    duration: easeDuration,
                    zoom,
                    pitch,
                    bearing: currentBearing + Math.max(-maxDiff, Math.min(maxDiff, bearingDiff)),
                    roll: cameraRoll,
                });
            }
            // TODO: Calculate % of geometry done based on current progressMs and update paint property line gradient instead of all data.
            onProgressMsChange(current);
            animation = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animation) {
                cancelAnimationFrame(animation);
            }
        };
    }, [isPlaying, isLayerAdded, followCurrentPoint, cameraAngle, cameraRoll, autoRotate, pitch, zoom, zoomInToImages, speedMultiplier, easeDuration]);

    return null;
};
