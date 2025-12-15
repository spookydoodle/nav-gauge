import { FC } from "react";
import { OverlayComponentProps } from "../../../apparatus";
import { ImageMarker, MarkerImageData } from "./ImageMarker";

export const ImageMarkers: FC<OverlayComponentProps> = ({
    geojson,
    images,
    onUpdateImageFeatureId
}) => {
    const markerImages = images.filter((image) => !!image.marker && !!image.markerElement) as MarkerImageData[];

    return markerImages.map((image) => (
        <ImageMarker
            key={image.id}
            image={image}
            geojson={geojson}
            onUpdateImageFeatureId={onUpdateImageFeatureId}
        />
    ));
};
