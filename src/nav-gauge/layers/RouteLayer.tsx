import { FC, useEffect, useMemo, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "../../map/useMap";
import { RouteTimes, GeoJson, ImageData } from "../../logic";
import { clearLayersAndSources, colorActive, colorInactive, getData, layerIds, sourceIds } from "../../logic/map-layers";
import { useGaugeContext } from "../../contexts/useGaugeContext";
import { ImageMarker, MarkerImageData } from "./ImageMarker";

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
    images
}) => {
    const { map } = useMap();
    const { showRouteLine, showRoutePoints } = useGaugeContext();
    const [isLayerAdded, setIsLayerAdded] = useState(false);

    useEffect(() => {
        const [currentPoint, lines] = getData(geojson, routeTimes.startTimeEpoch, progressMs);
        if (showRouteLine || showRoutePoints) {
            map.addSource(sourceIds.line, {
                type: 'geojson',
                data: lines,
            });
        }

        map.addSource(sourceIds.currentPoint, {
            type: 'geojson',
            data: currentPoint,
        });

        if (showRouteLine) {
            map.addLayer({
                id: layerIds.line,
                source: sourceIds.line,
                type: 'line',
                paint: {
                    'line-color': [
                        'case',
                        ['==', ['get', 'status'], 'before'],
                        colorActive,
                        colorInactive
                    ],
                    'line-width': 4,
                    'line-opacity': .6,
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round'
                }
            });
        }

        if (showRoutePoints) {
            map.addLayer({
                id: layerIds.points,
                source: sourceIds.line,
                type: 'circle',
                paint: {
                    'circle-color': [
                        'case',
                        ['==', ['get', 'status'], 'before'],
                        colorActive,
                        colorInactive
                    ],
                    'circle-radius': 3,
                }
            });
        }

        map.addLayer({
            id: layerIds.currentPointOutline,
            source: sourceIds.currentPoint,
            type: 'circle',
            paint: {
                'circle-color': 'white',
                'circle-radius': 7,
            }
        });
        map.addLayer({
            id: layerIds.currentPoint,
            source: sourceIds.currentPoint,
            type: 'circle',
            paint: {
                'circle-color': colorActive,
                'circle-radius': 5,
            }
        });

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

        if (loadedImages.length === 0 ) {
            return;
        }

        map.addSource(sourceIds.image, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: loadedImages.map((image): GeoJSON.Feature<GeoJSON.Point> => ({
                    type: 'Feature',
                    geometry: geojson.features.find((f) => f.properties.id === image.id)?.geometry!,
                    properties: {}
                }))
                    .filter((el) => !!el.geometry)
            }
        });

        // TODO: Style fallback for broken images
        map.addLayer({
            id: layerIds.images,
            type: 'circle',
            source: sourceIds.image,
            paint: {
                'circle-color': "red",
                "circle-radius": 5
            }
        });

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
        const { startTimeEpoch, endTimeEpoch } = routeTimes;
        let animation: number | undefined;
        let current = progressMs;

        const animate = () => {
            current += 10000;
            if (startTimeEpoch + current >= endTimeEpoch) {
                current = 0;
            }
            const [currentPoint, lines] = getData(geojson, startTimeEpoch, current);
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
    }, [isPlaying, isLayerAdded]);

    useEffect(() => {
        if (isPlaying) {
            return;
        }
        const { startTimeEpoch } = routeTimes;
        const [currentPoint, lines] = getData(geojson, startTimeEpoch, progressMs);
        map.getSource<maplibregl.GeoJSONSource>(sourceIds.currentPoint)?.setData(currentPoint);
        map.getSource<maplibregl.GeoJSONSource>(sourceIds.line)?.setData(lines);
    }, [progressMs]);

    const markerImages = useMemo(
        (): MarkerImageData[] => images.filter((image) => !!image.marker && !!image.markerElement) as MarkerImageData[],
        [images]
    );

    return markerImages.map((image) => <ImageMarker key={image.id} map={map} image={image} />);
};
