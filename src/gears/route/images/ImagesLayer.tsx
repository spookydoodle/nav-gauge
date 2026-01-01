import { FC, useEffect } from "react";
import { LoadedImageData, OverlayComponentProps, useMapImages, useStateWarden, IMAGE_SIZE } from "@apparatus";
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
            width: IMAGE_SIZE,
            height: IMAGE_SIZE
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
                'icon-size': 1 / (IMAGE_SIZE / 50),
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

    // TODO: Add drag handlers

    return null;
};
