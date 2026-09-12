import { FC, useEffect, useMemo, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { MapLayerData, MapSourceAndLayers, } from "@web-apparatus";
import { getCurrentPointImageName, routeSourceIds, layerOrder, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";
import { getWebCurrentPointLayers } from "./route-layers";

interface Props {
    map: maplibregl.Map;
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteCurrentPointLayer: FC<Props> = ({
    map,
    source,
    state,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageName = getCurrentPointImageName(state.currentPoint.icon);
    const imageSource = state.currentPoint.icon === 'Circle'
        ? Icons.Circle
        : Icons.NounProject[state.currentPoint.icon];

    useEffect(() => {
        const image = new Image();
        setImageLoaded(false);
        image.onload = () => {
            if (map.hasImage(imageName)) map.removeImage(imageName);
            map.addImage(imageName, image, { pixelRatio: Math.max(image.width, image.height) / 20, sdf: true });
            setImageLoaded(true);
        };
        image.src = imageSource;

        return () => {
            image.onload = null;
            if (map.hasImage(imageName)) map.removeImage(imageName);
        };
    }, [imageName, imageSource, map]);

    const mapLayerData = useMemo((): MapLayerData => ({
        sourceId: routeSourceIds.currentPoint,
        source: {
            type: 'geojson',
            data: source,
        },
        layers: imageLoaded ? getWebCurrentPointLayers(state) : [],
    }), [imageLoaded, source, state]);

    return (
        <MapSourceAndLayers
            map={map}
            mapLayerData={mapLayerData}
            layerOrder={layerOrder}
        />
    );
};
