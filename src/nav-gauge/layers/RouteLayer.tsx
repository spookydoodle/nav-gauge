import { FC, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "../../map/useMap";
import { RouteTimes, GeoJson, ImageData } from "../../logic";
import { clearLayersAndSources, currentPointLayers, getImagesSourceData, getRouteSourceData, imagesLayer, layerIds, routeLineLayer, routePointsLayer, sourceIds } from "../../logic/map-layers";
import { useGaugeContext } from "../../contexts/useGaugeContext";
import { ImageMarker, MarkerImageData } from "./ImageMarker";

interface Props {
    isPlaying: boolean;
    geojson: GeoJson;
    routeTimes: RouteTimes;
    progressMs: number;
    onProgressMsChange: React.Dispatch<React.SetStateAction<number>>;
    images: ImageData[];
    updateImageFeatureId: (imageId: number, featureId: number) => void;
}

export const RouteLayer: FC<Props> = ({
    isPlaying,
    geojson,
    routeTimes,
    progressMs,
    onProgressMsChange,
    images,
    updateImageFeatureId
}) => {
    const { map } = useMap();
    const { showRouteLine, showRoutePoints, followCurrentPoint, cameraAngle, autoRotate, pitch, zoom, zoomInToImages, speed } = useGaugeContext();
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
        let current = progressMs;

        const animate = () => {
            current += speed;
            if (startTimeEpoch + current >= endTimeEpoch) {
                current = 0;
            }
            const { currentPoint, lines } = getRouteSourceData(geojson, startTimeEpoch, current);
            if (followCurrentPoint) {
                const lngLat = new maplibregl.LngLat(currentPoint.geometry.coordinates[0], currentPoint.geometry.coordinates[1]);
                map.easeTo({
                    animate: true,
                    center: lngLat,
                    easeId: 'follow-current-point',
                    essential: true,
                    zoom,
                    pitch,
                    // TODO: 
                    bearing: autoRotate && cameraAngle ? 120 : undefined,
                    roll:5
                })
            }
            map.getSource<maplibregl.GeoJSONSource>(sourceIds.currentPoint)?.setData(currentPoint);
            map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(lines);
            
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
    }, [isPlaying, isLayerAdded, followCurrentPoint, cameraAngle, autoRotate, pitch, zoom, zoomInToImages, speed]);

    // useEffect(() => {
    //     if (isPlaying) {
    //         return;
    //     }
    //     const { startTimeEpoch } = routeTimes;
    //     const { currentPoint, lines } = getRouteSourceData(geojson, startTimeEpoch, progressMs);
    //     map.getSource<maplibregl.GeoJSONSource>(sourceIds.currentPoint)?.setData(currentPoint);
    //     map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(lines);
    // }, [progressMs]);

    const markerImages = images.filter((image) => !!image.marker && !!image.markerElement) as MarkerImageData[];

    return markerImages.map((image) => (
        <ImageMarker
            key={image.id}
            map={map}
            image={image}
            geojson={geojson}
            updateImageFeatureId={updateImageFeatureId}
        />
    ));
};
