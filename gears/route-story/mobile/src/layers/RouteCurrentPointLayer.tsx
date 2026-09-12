import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "@maplibre/maplibre-react-native";
import { RouteStoryState, routeLayerIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";

const styles = StyleSheet.create({
    marker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
    },
});

interface Props {
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteCurrentPointLayer: FC<Props> = ({ source, state }) => {
    if (source.type !== 'Feature' || source.geometry.type !== 'Point') return null;

    const [longitude, latitude] = source.geometry.coordinates;
    const iconSize = 20 * state.currentPoint.size;
    const outlinedIconSize = iconSize + state.currentPoint.outlineWidth * 2;
    const Icon = state.currentPoint.icon === 'Circle' ? Icons.Circle : Icons.NounProject[state.currentPoint.icon];

    return (
        <Marker id={routeLayerIds.currentPoint} lngLat={[longitude, latitude]} anchor="center" pointerEvents="none">
            <View style={[styles.marker, { width: outlinedIconSize, height: outlinedIconSize }]}>
                <Icon width={outlinedIconSize} height={outlinedIconSize} fill={state.currentPoint.outlineColor} style={styles.icon} />
                <Icon width={iconSize} height={iconSize} fill={state.currentPoint.fillColor} style={styles.icon} />
            </View>
        </Marker>
    );
};
