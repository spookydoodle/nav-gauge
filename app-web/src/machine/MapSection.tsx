import type * as maplibregl from "maplibre-gl";
import { FC, useEffect, useState } from "react";
import { useMapSection } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapCanvas } from "./map-canvas/MapCanvas";
import { MapToolsGridAreas } from "./map-tools-grid/MapToolsGridAreas";
import { GearsTopToolbar } from "./GearsTopToolbar";
import { Popups } from "./Popups";
import { createMap } from "./map";
import { ErrorBoundary } from "@ui";
import styles from './machine.module.css';

export const MapSection: FC = () => {
    const [map, setMap] = useState<maplibregl.Map>();
    const { cartomancer } = useWebMachineWard();
    const [overlays] = useSubjectState(cartomancer.overlays$);
    const { handleError } = useMapSection();

    useEffect(() => {
        const m = createMap();
        setMap(m);
        cartomancer.map = m;

        return () => {
            cartomancer.map = null;
            setMap(undefined);
            requestAnimationFrame(() => m.remove());
        };
    }, []);

    return (
        <div className={styles.machine}>
            <GearsTopToolbar />
            {map ? (
                <ErrorBoundary onError={handleError}>
                    <MapCanvas map={map}>
                        {[...overlays.entries()].map(([id, OverlayComponent]) => (
                            <ErrorBoundary key={id} onError={handleError}>
                                <OverlayComponent key={id} map={map} />
                            </ErrorBoundary>
                        ))}
                    </MapCanvas>
                </ErrorBoundary>
            ) : null}
            <MapToolsGridAreas map={map} />
            <Popups map={map} />
        </div>
    );
};
