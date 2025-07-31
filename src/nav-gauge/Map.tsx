import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import maplibregl from "maplibre-gl";
import classNames from "classnames";
import { createMaplibreMap, MapContext } from "../map/map-context";
import './map.css';

interface Props {
    controlPosition: maplibregl.ControlPosition;
    showZoom: boolean;
    showCompass: boolean;
    showGreenScreen: boolean;
    children?: ReactNode;
}

export const Map: FC<Props> = ({
    controlPosition,
    showZoom,
    showCompass,
    showGreenScreen,
    children,
}) => {
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [cssLoaded, setCssLoaded] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const map = useMemo(() => createMaplibreMap(), []);
    const [mapZoom, setMapZoom] = useState(0);

    useEffect(() => {
        const abortController = new AbortController();
        const head = document.getElementsByTagName('head')?.[0];
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.onload = () => setCssLoaded(true);
        link.onerror = (err) => console.error(err);
        link.href = `https://unpkg.com/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl.css`;
        head.appendChild(link);

        return () => {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        if (!containerRef || !cssLoaded) {
            return;
        }
        const mapContainer = map.getContainer();
        containerRef.appendChild(mapContainer);
        setIsInitialized(true);

        return () => {
            containerRef.removeChild(mapContainer);
        };
    }, [containerRef, cssLoaded]);

    useEffect(() => {
        const showControls = showZoom || showCompass;
        if (!isInitialized || !showControls) {
            return;
        }
        const control = new maplibregl.NavigationControl({ showZoom, showCompass, visualizePitch: true });
        map.addControl(control, controlPosition);
        map.resize();

        return () => {
            map.removeControl(control);
        };
    }, [isInitialized, showZoom, showCompass, controlPosition]);

    useEffect(() => {
        const zoomHandler = () => {
            setMapZoom(map.getZoom());
        }
        map.on("zoomend", zoomHandler);

        return () => {
            map.off("zoomend", zoomHandler);
        };
    }, []);

    return (
        <MapContext.Provider value={{ map, mapZoom }}>
            <div ref={setContainerRef} className={classNames("nav-gauge-map", {
                "with-green-screen": showGreenScreen
            })} />
            {children}
        </MapContext.Provider>
    );
};
