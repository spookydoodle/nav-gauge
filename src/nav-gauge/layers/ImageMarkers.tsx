import { FC } from "react";
import { GeoJson, ImageData } from "../../logic";
import { ImageMarker, MarkerImageData } from "./ImageMarker";
import { useStateWarden } from "../../contexts/state-warden/useStateWarden";

interface Props {
    geojson: GeoJson;
    images: ImageData[];
    updateImageFeatureId: (imageId: number, featureId: number) => void;
}

export const ImageMarkers: FC<Props> = ({
    geojson,
    images,
    updateImageFeatureId
}) => {
    const markerImages = images.filter((image) => !!image.marker && !!image.markerElement) as MarkerImageData[];

    return markerImages.map((image) => (
        <ImageMarker
            key={image.id}
            image={image}
            geojson={geojson}
            updateImageFeatureId={updateImageFeatureId}
        />
    ));
};
