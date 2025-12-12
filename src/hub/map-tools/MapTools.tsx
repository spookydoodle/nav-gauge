import { FC, ReactNode, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import classNames from "classnames";
import { useGaugeContext, useStateWarden } from "../../contexts";
import { useSubjectState } from "../../hooks";
import { Cartomancer } from "../../apparatus";
import findIcon from '../../icons/find.svg';
import * as styles from './map-tools.module.css';
import './map.css';

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
    const { cartomancer } = useStateWarden();
    const { map } = cartomancer;
    const { showZoomButtons, showCompass, showGreenScreen, controlPosition, globeProjection } = useGaugeContext();
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [cssLoaded, setCssLoaded] = useState(false);
    const [isInitialised, setIsInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartomancer.isStyleLoaded$);
    const [selectedStyleId] = useSubjectState(cartomancer.selectedStyleId$);
    const [_mapZoom, setMapZoom] = useSubjectState(cartomancer.zoom$);

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
            map.resize();
        };
        // TODO: Observer parent
        window.addEventListener('resize', resizeHandler);
        const control = new maplibregl.NavigationControl({ showZoom: showZoomButtons, showCompass, visualizePitch: true });
        map.addControl(control, controlPosition);
        map.resize();

        return () => {
            map.removeControl(control);
            window.removeEventListener('resize', resizeHandler);
        };
    }, [isInitialised, showZoomButtons, showCompass, controlPosition]);

    useEffect(() => {
        const zoomHandler = () => {
            setMapZoom(map.getZoom());
        };
        map.on("zoomend", zoomHandler);

        return () => {
            map.off("zoomend", zoomHandler);
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

    useEffect(() => {
        const nextStyle = Cartomancer.styles.get(selectedStyleId);
        if (!nextStyle) {
            return;
        }

        const abortController = new AbortController();
        cartomancer.updateStyle(nextStyle.style, abortController.signal, (err) => {
            if (!abortController.signal.aborted) {
                console.error(err)
            }
        });

        return () => {
            abortController.abort();
        };
    }, [selectedStyleId]);

    useEffect(() => {
        if (!isInitialised) {
            return;
        }
        (async () => {
            if (!map.hasImage('placeholder')) {
                const image = new Image();
                const promise = new Promise((resolve) => {
                    image.onload = resolve;
                });
                image.src = findIcon;
                await promise;
                image.width = 20;
                image.height = 20;
                map.addImage('placeholder', image);
            }
        })();

        return () => {
            if (map.hasImage('placeholder')) {
                map.removeImage('placeholder');
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
