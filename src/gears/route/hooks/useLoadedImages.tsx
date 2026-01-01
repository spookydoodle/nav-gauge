import { useMemo } from "react";
import { LoadedImageData, MarkerImage } from "@apparatus";

/**
 * @returns Filtered images with valid data and assignment to a feature id.
 */
export const useLoadedImages = (images: MarkerImage[]) => {
    const loadedImages: LoadedImageData[] = useMemo(() => images.filter(({ progress, error, ...image }) =>
        progress === 100 && image.data && image.featureId !== undefined
    ) as LoadedImageData[], [images]);

    return loadedImages;
};
