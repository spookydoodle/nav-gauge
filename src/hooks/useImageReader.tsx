import { useState } from "react";
import { ImageData, parseImage } from "../parsers";

export const useImageReader = (): [ImageData[], (file: File) => void] => {
    const [images, setImages] = useState<ImageData[]>([]);

    const readImage = (file: File) => {
        const reader = new FileReader();

        const getNext = (ids: number[]) => {
            let i = 0;
            while (ids.includes(i)) {
                i++;
            }
            return i;
        };

        reader.onloadstart = () => {
            setImages((prev) => prev.filter((el) => el.name !== file.name).concat({
                id: getNext(prev.map((el) => el.id)),
                name: file.name,
                progress: 0
            }));
        };

        reader.onprogress = (e) => {
            setImages((prev) => {
                const nextImages = prev.slice();
                const index = prev.findIndex((el) => el.name === file.name);
                nextImages[index] = { ...nextImages[index], progress: Number((e.loaded / e.total * 100).toFixed(0)) }
                return nextImages;
            });
        };

        reader.onload = async (e) => {
            const { data, exif, lngLat, error } = await parseImage(file, e);
            setImages((prev) => {
                const nextImages = prev.slice();
                const index = prev.findIndex((el) => el.name === file.name);
                nextImages[index] = { ...nextImages[index], progress: 100, lngLat, data, exif, error }
                return nextImages;
            });
        };

        reader.onerror = (e) => {
            setImages((prev) => {
                const nextImages = prev.slice();
                const index = prev.findIndex((el) => el.name === file.name);
                nextImages[index] = { ...nextImages[index], error: e.target?.error?.message ?? 'Cannot read file' }
                return nextImages;
            });
        };

        reader.readAsDataURL(file);
    };

    return [images, readImage];
};
