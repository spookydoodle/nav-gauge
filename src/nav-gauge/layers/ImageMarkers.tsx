import { FC, useEffect } from "react";
import { useMap } from "../../map/useMap";
import { GeoJson, ImageData } from "../../logic";
import { ImageMarker, MarkerImageData } from "./ImageMarker";

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
    const { map } = useMap();
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
