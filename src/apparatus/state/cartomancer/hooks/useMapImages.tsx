import { useEffect } from "react";
import { useStateWarden } from "@apparatus";

export interface MapImageData {
    icon: string | ImageBitmap;
    name: string;
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
            for (const { icon, name, options: { width, height, ...metadata } = {} } of imagesData) {
                if (map.hasImage(name)) {
                    map.removeImage(name);
                }

                if (typeof icon === 'string') {
                    const image = new Image(width, height);
                    image.onload = () => {
                        if (map.hasImage(name)) {
                            map.removeImage(name);
                        }
                        map.addImage(name, image, metadata);
                    }
                    image.src = icon;
                } else {
                    map.addImage(name, icon, metadata);
                }
            }
        })();

        return () => {
            for (const { name } of imagesData) {
                if (map.hasImage(name)) {
                    map.removeImage(name);
                }
            }
        };
    }, [map, data]);

    return null;
};
