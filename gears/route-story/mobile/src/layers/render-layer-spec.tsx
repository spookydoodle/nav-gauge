import { Layer } from "@maplibre/maplibre-react-native";
import { RouteCircleLayerSpec, RouteLineLayerSpec } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const renderLayerSpec = (spec: RouteLineLayerSpec | RouteCircleLayerSpec) => {
    if (spec.type === 'line') {
        return (
            <Layer
                key={spec.id}
                type="line"
                id={spec.id}
                filter={spec.filter}
                layout={spec.layout}
                paint={spec.paint}
            />
        );
    }

    return (
        <Layer
            key={spec.id}
            type="circle"
            id={spec.id}
            filter={spec.filter}
            paint={spec.paint}
        />
    );
};
