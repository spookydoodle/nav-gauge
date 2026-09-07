import { FC, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { BehaviorSubject } from "rxjs";
import { CameraRef, MapRef } from "@maplibre/maplibre-react-native";
import { useMapSection } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";
import { MapToolsGridAreas } from "./map-tools-grid/MapToolsGridAreas";
import { GearsTopToolbar } from "./GearsTopToolbar";
import { Popups } from "./Popups";
import {
    MapCanvas,
    dragPan$,
    onPressHandlers$,
    onLongPressHandlers$,
    onPanResponderStartHandlers$,
    onPanResponderMoveHandlers$,
    onPanResponderEndHandlers$
} from "./map-canvas/MapCanvas";
import { ErrorBoundary } from "@ui";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    mapView: {
        flex: 1,
    },
});

const map: MobileMap = {
    map$: new BehaviorSubject<MapRef | null>(null),
    camera$: new BehaviorSubject<CameraRef | null>(null),
    mapSize$: new BehaviorSubject<{ width: number; height: number; }>({ width: 100, height: 100 }),
    dragPan$,
    onPressHandlers$,
    onLongPressHandlers$,
    onPanResponderStartHandlers$,
    onPanResponderMoveHandlers$,
    onPanResponderEndHandlers$,
};

export const MapSection: FC = () => {
    const { cartomancer } = useMobileMachineWard();
    const [overlays] = useSubjectState(cartomancer.overlays$);
    const { handleError } = useMapSection();

    useEffect(() => {
        cartomancer.map = map;

        return () => {
            cartomancer.map = null;
        };
    }, []);

    return (
        <View style={styles.container}>
            <ErrorBoundary onError={handleError}>
                <MapCanvas map={map}>
                    {[...overlays.entries()].map(([id, OverlayComponent]) => (
                        <ErrorBoundary key={id} onError={handleError}>
                            <OverlayComponent key={id} map={map} />
                        </ErrorBoundary>
                    ))}
                </MapCanvas>
            </ErrorBoundary>
            <GearsTopToolbar />
            <MapToolsGridAreas map={map} />
            <Popups map={map} />
        </View>
    );
};
