import { FC, useEffect } from "react";
import ReactDOM from 'react-dom';
import * as styles from './route-layer.module.css';
import { ImageData } from "../../parsers";

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
        image.marker.addTo(map);

        return () => {
            image.marker.remove();
        };
    }, [image]);

    return ReactDOM.createPortal(
        <img src={image.data} alt={`image ${image.id}`} width={30} height={30} className={styles['image-marker']} />,
        image.markerElement
    );
};
