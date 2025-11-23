import { FC, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import maplibregl from "maplibre-gl";
import { FeatureStateProps, GeoJson, getClosestFeature, ImageData, sourceIds } from "../../logic";
import { useStateWarden } from "../../contexts/state-warden/useStateWarden";
import * as styles from './route-layer.module.css';

export type MarkerImageData = Omit<ImageData, 'marker' | 'markerElement'> & {
    marker: maplibregl.Marker;
    markerElement: HTMLDivElement;
}

interface Props {
    image: MarkerImageData;
    updateImageFeatureId: (imageId: number, featureId: number) => void;
    geojson: GeoJson;
}

// TODO: If multiple in the same location, render all
export const ImageMarker: FC<Props> = ({ image, geojson, updateImageFeatureId }) => {
    const { cartographer: { map } } = useStateWarden();
    const [closestFeatureId, setClosestFeatureId] = useState<number | null>(null);

    useEffect(() => {
        const handleDrag = () => {
            const lngLat = image.marker.getLngLat();
            setClosestFeatureId(getClosestFeature(lngLat, geojson)[0]);
        };
        const handleDragEnd = () => {
            const lngLat = image.marker.getLngLat();
            const [id, feature] = getClosestFeature(lngLat, geojson);
            image.marker.setLngLat(new maplibregl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]));
            updateImageFeatureId(image.id, id);

            setClosestFeatureId(null);
        };

        image.marker.addTo(map);
        image.marker.on('drag', handleDrag);
        image.marker.on('dragend', handleDragEnd);

        return () => {
        image.marker.off('drag', handleDrag);
        image.marker.off('dragend', handleDragEnd);
            image.marker.remove();
        };
    }, [image]);

    useEffect(() => {
        if (closestFeatureId === null) {
            return;
        }
        // TODO: Add another source for all points or closest point and update data here
        const updateHighlight = (highlight: boolean) => {
            map.setFeatureState({ source: sourceIds.line, id: closestFeatureId }, {
                [FeatureStateProps.Highlight]: highlight
            });
        }
        updateHighlight(true);
        
        return () => {
            updateHighlight(false);
        };
    }, [closestFeatureId]);

    return ReactDOM.createPortal(
        <img src={image.data} alt={`image ${image.id}`} width={30} height={30} className={styles['image-marker']} />,
        image.markerElement
    );
};
