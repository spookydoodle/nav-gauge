import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "@maplibre/maplibre-react-native";
import { useMobileMachineWard } from "@mobile-apparatus";
import { RouteStoryState, routeLayerIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";
import { useSubjectState } from "@tinker-chest";

const styles = StyleSheet.create({
    marker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface Props {
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteCurrentPointLayer: FC<Props> = ({ source, state }) => {
    const { cartomancer } = useMobileMachineWard();
    const [mapBearing] = useSubjectState(cartomancer.bearing$);
    if (source.type !== 'Feature' || source.geometry.type !== 'Point') return null;

    const [longitude, latitude] = source.geometry.coordinates;
    const iconSize = 20 * state.currentPoint.size;
    const heading = source.properties?.heading;
    const rotation = state.currentPoint.rotation
        + (state.currentPoint.autoRotate && typeof heading === 'number' ? heading : 0)
        - (state.currentPoint.rotationAlignment === 'map' ? mapBearing : 0);
    const Icon = state.currentPoint.icon === 'Circle' ? Icons.Circle : Icons.NounProject[state.currentPoint.icon];

    return (
        <Marker id={routeLayerIds.currentPoint} lngLat={[longitude, latitude]} anchor="center" pointerEvents="none">
            <View style={[styles.marker, { width: iconSize, height: iconSize, transform: [{ rotate: `${rotation}deg` }] }]}>
                <Icon width={iconSize} height={iconSize} fill={state.currentPoint.fillColor} />
            </View>
        </Marker>
    );
};
