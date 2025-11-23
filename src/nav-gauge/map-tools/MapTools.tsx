import { FC, ReactNode, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { Protocol, PMTiles } from "pmtiles";
import classNames from "classnames";
import { useGaugeContext } from "../../contexts/gauge/useGaugeContext";
import { useSubjectState } from "../../hooks/useSubjectState";
import { useStateWarden } from "../../contexts/state-warden/useStateWarden";
import findIcon from '../../icons/find.svg';
import * as styles from './map-tools.module.css';
import './map.css';
import { Cartographer } from "../../logic/state/cartographer";

interface Props {
    /**
     * Tools to display on the top side of the main map section.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     */
    toolsTop?: ReactNode;
    /**
     * Tools to display on the right side of the main map section.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     */
    toolsRight?: ReactNode;
    /**
     * Tools to display on the bottom side of the main map section.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     */
    toolsBottom?: ReactNode;
    /**
     * Tools to display on the left side of the main map section.
     * Have access to map context and will not be unmounted for the duration of the style updates. 
     * Do not update sources and layers in components passed in this prop as it might lead to MapLibre's `Style is not done loading` errors.
     */
    toolsLeft?: ReactNode;
    /**
     * Will be unmounted for the duration of style updates.
     */
    children?: ReactNode;
}

export const MapTools: FC<Props> = ({
    toolsTop,
    toolsRight,
    toolsBottom,
    toolsLeft,
    children,
}) => {
    const { cartographer, attributionVault } = useStateWarden();
    const { showZoomButtons, showCompass, showGreenScreen, controlPosition, globeProjection } = useGaugeContext();
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [cssLoaded, setCssLoaded] = useState(false);
    const [isInitialised, setIsInitialised] = useSubjectState(cartographer.isInitialised$);
    const [isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartographer.isStyleLoaded$);
    const [selectedStyleId] = useSubjectState(cartographer.selectedStyleId$);
    const [_mapZoom, setMapZoom] = useSubjectState(cartographer.zoom$);

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
        const mapContainer = cartographer.map.getContainer();
        containerRef.appendChild(mapContainer);
        const protocolId = 'pmtiles';
        const protocol = new Protocol();
        maplibregl.addProtocol(protocolId, protocol.tile);

        setIsInitialised(true);

        return () => {
            maplibregl.removeProtocol(protocolId);
            containerRef.removeChild(mapContainer);
        };
    }, [containerRef, cssLoaded]);

    useEffect(() => {
        const showControls = showZoomButtons || showCompass;
        if (!isInitialised || !showControls) {
            return;
        }
        const resizeHandler = () => {
            cartographer.map.resize();
        };
        // TODO: Observer parent
        window.addEventListener('resize', resizeHandler);
        const control = new maplibregl.NavigationControl({ showZoom: showZoomButtons, showCompass, visualizePitch: true });
        cartographer.map.addControl(control, controlPosition);
        cartographer.map.resize();

        return () => {
            cartographer.map.removeControl(control);
            window.removeEventListener('resize', resizeHandler);
        };
    }, [isInitialised, showZoomButtons, showCompass, controlPosition]);

    useEffect(() => {
        const zoomHandler = () => {
            setMapZoom(cartographer.map.getZoom());
        };
        cartographer.map.on("zoomend", zoomHandler);

        return () => {
            cartographer.map.off("zoomend", zoomHandler);
        };
    }, []);

    useEffect(() => {
        const nextStyle = Cartographer.styles.get(selectedStyleId);
        if (!nextStyle) {
            return;
        }
        cartographer.updateStyle(nextStyle.style);
        if (nextStyle.attribution) {
            attributionVault.addEntry(selectedStyleId, nextStyle.attribution);
        }
        
        return () => {
            if (nextStyle.attribution) {
                attributionVault.removeEntry(selectedStyleId);
            }
        };
    }, [selectedStyleId]);

    useEffect(() => {
        if (!isStyleLoaded) {
            return;
        }
        cartographer.map.setProjection({ type: globeProjection ? 'globe' : 'mercator' });
        cartographer.map.resize();

        const projectionHandler = () => {
            if (cartographer.map.isStyleLoaded()) {
                cartographer.map.setProjection({ type: globeProjection ? 'globe' : 'mercator' });
                cartographer.map.resize()
            }
        };
        cartographer.map.on('style.load', projectionHandler);

        return () => {
            cartographer.map.off('style.load', projectionHandler);
        };
    }, [isStyleLoaded, globeProjection]);

    useEffect(() => {
        if (!isInitialised) {
            return;
        }
        (async () => {
            if (!cartographer.map.hasImage('placeholder')) {
                const image = new Image();
                const promise = new Promise((resolve) => {
                    image.onload = resolve;
                });
                image.src = findIcon;
                await promise;
                image.width = 20;
                image.height = 20;
                cartographer.map.addImage('placeholder', image);
            }
        })();

        return () => {
            if (cartographer.map.hasImage('placeholder')) {
                cartographer.map.removeImage('placeholder');
            }
        };
    }, [isInitialised]);

    return (
        <div className={styles["container"]}>
            <div className={classNames(styles["toolbox"], styles["top"])}>
                {toolsTop}
            </div>
            <div className={classNames(styles["toolbox"], styles["right"])}>
                {toolsRight}
            </div>
            <div className={classNames(styles["toolbox"], styles["bottom"])}>
                {toolsBottom}
            </div>
            <div className={classNames(styles["toolbox"], styles["left"])}>
                {toolsLeft}
            </div>
            <div className={styles["map-area"]}>
                <div ref={setContainerRef} className={classNames(styles["nav-gauge-map"], {
                    [styles["with-green-screen"]]: showGreenScreen
                })}>
                    {isStyleLoaded ? children : null}
                </div>
            </div>
        </div>
    );
};
