import { FC, useMemo } from "react";
import { GeoJSONSource } from "@maplibre/maplibre-react-native";
import { getCameraLineLayers, routeSourceIds, SplineData } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { renderLayerSpec } from "./render-layer-spec";

interface Props {
    spline: SplineData;
}

export const DebugRouteCameraLineLayer: FC<Props> = ({ spline }) => {
    const data = useMemo(
        () => ({
            type: 'FeatureCollection' as const,
            features: [spline.spline],
        }),
        [spline],
    );

    return (
        <GeoJSONSource
            id={routeSourceIds.cameraLine}
            data={data}
        >
            {getCameraLineLayers().map(renderLayerSpec)}
        </GeoJSONSource>
    );
};