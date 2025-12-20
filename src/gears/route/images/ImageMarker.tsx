import { CSSProperties, FC, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import maplibregl from "maplibre-gl";
import { Cartomancer, GeoJson, MarkerImage } from "../../../apparatus";
import { FeatureStateProps } from "../../../apparatus/state/cartomancer/map-layers";
import { sourceIds } from '../tinkers';
import { useStateWarden, useGaugeContext } from "../../../contexts";
import { useSubjectState } from "../../../hooks";
import * as styles from './images.module.css';

const imageSize = 30;

export type MarkerImageData = Omit<MarkerImage, 'marker' | 'markerElement'> & {
    marker: maplibregl.Marker;
    markerElement: HTMLDivElement;
}

interface Props {
    image: MarkerImageData;
    onUpdateImageFeatureId: (imageId: number, featureId: number) => void;
    geojson: GeoJson;
}

// TODO: If multiple in the same location, render all
export const ImageMarker: FC<Props> = ({ image, geojson, onUpdateImageFeatureId }) => {
    const { cartomancer: { map }, animatrix } = useStateWarden();
    const [closestFeatureId, setClosestFeatureId] = useState<number | null>(null);
    const [displayImageId] = useSubjectState(animatrix.displayImageId$);
    const { size } = useGaugeContext();

    useEffect(() => {
        const handleDrag = () => {
            const lngLat = image.marker.getLngLat();
            setClosestFeatureId(Cartomancer.getClosestFeature(geojson, lngLat)[0]);
        };
        const handleDragEnd = () => {
            const lngLat = image.marker.getLngLat();
            const [id, feature] = Cartomancer.getClosestFeature(geojson, lngLat);
            image.marker.setLngLat(new maplibregl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]));
            onUpdateImageFeatureId(image.id, id);

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
        <img
            src={image.data}
            alt={`image ${image.id}`}
            className={classNames(styles['image-marker'], {
                [styles['in-display']]: displayImageId === image.id
            })}
            style={{
                // TODO: Add ref client size observer to handle the "full screen" size
                '--image-size': `${imageSize}px`,
                '--image-display-scale': Math.ceil(Math.min(size.width, size.height) / imageSize)
            } as CSSProperties}
        />,
        image.markerElement
    );
};
