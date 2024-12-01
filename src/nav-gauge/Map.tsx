import React from "react";
import maplibregl from "maplibre-gl";
import { osmStyle } from "../map-style/osm";
import './map.css';

const maplibreMap: maplibregl.Map = new maplibregl.Map({
    container: document.createElement('div'),
    style: osmStyle,
    attributionControl: false
});

interface Props {
    controlPosition: maplibregl.ControlPosition;
    showZoom: boolean;
    showCompass: boolean;
}

export const Map: React.FC<Props> = ({
    controlPosition,
    showZoom,
    showCompass,
}) => {
    const [containerRef, setContainerRef] = React.useState<HTMLElement | null>(null);
    const [cssLoaded, setCssLoaded] = React.useState(false);
    const [isInitialized, setIsInitialized] = React.useState(false);

    React.useEffect(() => {
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

    React.useEffect(() => {
        if (!containerRef || !cssLoaded) {
            return;
        }
        const mapContainer = maplibreMap.getContainer();
        containerRef.appendChild(mapContainer);
        setIsInitialized(true);

        return () => {
            containerRef.removeChild(mapContainer);
        };
    }, [containerRef, cssLoaded]);

    React.useEffect(() => {
        const showControls = showZoom || showCompass;
        if (!isInitialized || !showControls) {
            return;
        }
        const control = new maplibregl.NavigationControl({ showZoom, showCompass, visualizePitch: true });
        maplibreMap.addControl(control, controlPosition);

        return () => {
            maplibreMap.removeControl(control);
        };
    }, [isInitialized, showZoom, showCompass, controlPosition]);

    return (
        <>
            <div ref={setContainerRef} className="nav-gauge-map" />
        </>
    );
};
