import { FC, useEffect } from "react";
import ReactDOM from 'react-dom';
import * as styles from './route-layer.module.css';
import { ImageData } from "../../logic";

export type MarkerImageData = Omit<ImageData, 'marker' | 'markerElement'> & {
    marker: maplibregl.Marker;
    markerElement: HTMLDivElement;
}

interface Props {
    map: maplibregl.Map;
    image: MarkerImageData;
}

// TODO: If multiple in the same location, render all
export const ImageMarker: FC<Props> = ({ map, image }) => {
    useEffect(() => {
        const handleDrag = () => {
            const lngLat = image.marker.getLngLat();
            console.log('drag', lngLat);
        };
        const handleDragEnd = () => {
            const lngLat = image.marker.getLngLat();
            console.log('dragend', lngLat);
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

    return ReactDOM.createPortal(
        <img src={image.data} alt={`image ${image.id}`} width={30} height={30} className={styles['image-marker']} />,
        image.markerElement
    );
};
