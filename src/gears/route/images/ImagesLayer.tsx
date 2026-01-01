import { FC, useEffect } from "react";
import { LoadedImageData, OverlayComponentProps, useMapImages, useStateWarden } from "@apparatus";
import { useLoadedImages } from "../hooks/useLoadedImages";
import { sourceIds, layerIds } from '../tinkers';

const getId = (image: LoadedImageData): string => `image-${image.id}`;

export const ImagesLayer: FC<OverlayComponentProps> = ({
    geojson,
    images,
    onProgressMsChange,
    onUpdateImageFeatureId,
    progressMs,
    routeTimes,
}) => {
    const { cartomancer } = useStateWarden();
    const { map } = cartomancer;
    const loadedImages = useLoadedImages(images);

    useMapImages(loadedImages.filter((image) => !!image.data).map((image) => ({
        icon: image.data,
        name: getId(image),
        options: {
            // width: 24,
            // height: 24
        }
    })))

    useEffect(() => {
        map.addSource(sourceIds.image, {
            type: "geojson",
            data: {
                type: 'FeatureCollection',
                features: loadedImages.reduce<GeoJSON.Feature[]>((acc, image) => {
                    const feature = geojson.features.find((f) => f.properties.id === image.featureId);
                    if (!feature) {
                        return acc;
                    }
                    return acc.concat([{
                        ...feature,
                        properties: {
                            image: getId(image)
                        }
                    }]);
                }, [])
            }
        });

        map.addLayer({
            id: layerIds.images,
            source: sourceIds.image,
            type: 'symbol',
            layout: {
                'icon-image': ['get', 'image'],
                'icon-size': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5, 1,
                    10, 1,
                    15, 1
                ],
                'icon-allow-overlap': true
            },
            paint: {
            }
        });

        return () => {
            map.removeLayer(layerIds.images);
            map.removeSource(sourceIds.image);
        };
    }, [map, loadedImages]);

    return null;
};
