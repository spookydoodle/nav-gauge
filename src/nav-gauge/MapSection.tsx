import { FC, ReactNode, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import classNames from "classnames";
import { map, MapContext } from "../map/map-context";
import './map.css';

interface Props {
    controlPosition: maplibregl.ControlPosition;
    globeProjection: boolean;
    showZoom: boolean;
    showCompass: boolean;
    showGreenScreen: boolean;
    /**
     * Will be unmounted for the duration of style updates.
     */
    layerData?: ReactNode;
    /**
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     */
    children?: ReactNode;
}

export const MapSection: FC<Props> = ({
    controlPosition,
    globeProjection,
    showZoom,
    showCompass,
    showGreenScreen,
    layerData,
    children,
}) => {
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [cssLoaded, setCssLoaded] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isStyleLoaded, setIsStyleLoaded] = useState(false);
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
        };
        const styleCheckHandler = () => {
            if (map.isStyleLoaded()) {
                setIsStyleLoaded(true);
            }
        }
        map.on("zoomend", zoomHandler);
        map.on('data', styleCheckHandler);

        return () => {
            map.off("zoomend", zoomHandler);
            map.off('data', styleCheckHandler);
        };
    }, []);

    useEffect(() => {
        if (!isStyleLoaded) {
            return;
        }
        map.setProjection({ type: globeProjection ? 'globe' : 'mercator' });
        map.resize();

        const projectionHandler = () => {
            if (map.isStyleLoaded()) {
                map.setProjection({ type: globeProjection ? 'globe' : 'mercator' });
                map.resize()
            }
        };
        map.on('style.load', projectionHandler);

        return () => {
            map.off('style.load', projectionHandler);
        };
    }, [isStyleLoaded, globeProjection]);

    return (
        <MapContext.Provider value={{ map, mapZoom }}>
            <div className="container">
                <div className="toolbox top">
                    {children}
                </div>
                <div className="toolbox right">
                    {children}
                </div>
                <div className="toolbox bottom">
                    {children}
                </div>
                <div className="toolbox left">
                    {children}
                </div>
                <div ref={setContainerRef} className={classNames("nav-gauge-map", {
                    "with-green-screen": showGreenScreen
                })}>
                    {isStyleLoaded ? layerData : null}
                </div>
            </div>
        </MapContext.Provider>
    );
};
