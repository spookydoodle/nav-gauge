import { useEffect } from "react";
import { useStateWarden } from "@apparatus";

export interface MapImageData {
    icon: string | ImageBitmap;
    iconImageId: string;
    options?: {
        width?: number;
        height?: number;
    } & Partial<maplibregl.StyleImageMetadata>
}

export const useMapImages = (
    data: MapImageData | MapImageData[]
) => {
    const { cartomancer } = useStateWarden();
    const { map } = cartomancer;

    useEffect(() => {
        const imagesData = Array.isArray(data) ? data : [data];
        (async () => {
            for (const { icon, iconImageId, options: { width, height, ...metadata } = {} } of imagesData) {
                if (map.hasImage(iconImageId)) {
                    map.removeImage(iconImageId);
                }

                if (typeof icon === 'string') {
                    const image = new Image(width, height);
                    image.onload = () => {
                        if (map.hasImage(iconImageId)) {
                            map.removeImage(iconImageId);
                        }
                        map.addImage(iconImageId, image, metadata);
                    }
                    image.src = icon;
                } else {
                    map.addImage(iconImageId, icon, metadata);
                }
            }
        })();

        return () => {
            for (const { iconImageId } of imagesData) {
                if (map.hasImage(iconImageId)) {
                    map.removeImage(iconImageId);
                }
            }
        };
    }, [map, data]);

    return null;
};
