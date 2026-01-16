import { useEffect } from "react";
import { useStateWarden } from "../../useStateWarden";

let timeout: NodeJS.Timeout | undefined;

/**
 * For geojson sources.
 * @param sourceId GeoJSON source ID.
 * @param updatedData Memoized data. Changes will trigger `source.setData` action.
 */
export const useUpdateSourceData = (
    sourceId: string,
    updatedData: GeoJSON.GeoJSON,
    delay?: number
) => {
    const { cartomancer } = useStateWarden();
    const { map } = cartomancer;

    useEffect(() => {
        if (!sourceId) {
            return;
        }

        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
        if (!source || source.type !== 'geojson') {
            return;
        }

        if (delay) {
            timeout = setTimeout(() => {
                source.setData(updatedData);
            }, delay);
        } else {
            source.setData(updatedData);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [sourceId, updatedData, delay]);
};
