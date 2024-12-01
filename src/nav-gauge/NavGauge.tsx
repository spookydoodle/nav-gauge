import React from "react";
import maplibregl from "maplibre-gl";
import { Map } from "./Map";
import './nav-gauge.css';

const controlsPositions: maplibregl.ControlPosition[] = ["top-left", "top-right", "bottom-left", "bottom-right"];
interface MapLayout {
    width: number;
    height: number;
    borderRadius: string;
    borderWidth: number;
    borderColor: string;
    boxShadow: string;
    // TODO: Add secondary
};

// TODO: Add saving in local storage

interface ControlPlacement {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export const NavGauge: React.FC = () => {
    const [showZoom, setShowZoom] = React.useState(false);
    const [showCompass, setShowCompass] = React.useState(true);
    const [controlPosition, setControlPosition] = React.useState<maplibregl.ControlPosition>('top-right');
    const [controlPlacement, setControlPlacement] = React.useState<ControlPlacement>({ top: 0, bottom: 0, left: 0, right: 0 });
    const [mapLayout, setMapLayout] = React.useState<MapLayout>({ width: 200, height: 200, borderColor: '#ff0000', borderRadius: '50%', borderWidth: 5, boxShadow: '0px 0px 16px #ff0000, 0px 0px 16px #ff0000' })

    const placements = React.useMemo(
        (): (keyof ControlPlacement)[] => {
            switch (controlPosition) {
                case 'top-left': return ['top', 'left']
                case 'top-right': return ['top', 'right']
                case 'bottom-left': return ['bottom', 'left']
                case 'bottom-right': return ['bottom', 'right']
            }
        },
        [controlPosition]
    );

    const controlsCssStyle = React.useMemo(
        () => {
            switch (controlPosition) {
                case 'top-left': return { '--ctrl-top': controlPlacement.top + 'px', '--ctrl-left': controlPlacement.left + 'px' }
                case 'top-right': return { '--ctrl-top': controlPlacement.top + 'px', '--ctrl-right': controlPlacement.right + 'px' }
                case 'bottom-left': return { '--ctrl-bottom': controlPlacement.bottom + 'px', '--ctrl-left': controlPlacement.left + 'px' }
                case 'bottom-right': return { '--ctrl-bottom': controlPlacement.bottom + 'px', '--ctrl-right': controlPlacement.right + 'px' }
            }
        },
        [controlPosition, controlPlacement]
    );

    const mapLayoutCssStyle = React.useMemo(
        () => {
            return { 
                '--map-width': mapLayout.width + 'px', 
                '--map-height': mapLayout.height + 'px',
                '--map-border-width': mapLayout.borderWidth + 'px',
                '--map-border-color': mapLayout.borderColor,
                '--map-radius': mapLayout.borderRadius,
                '--map-box-shadow': mapLayout.boxShadow,
            }
        },
        [mapLayout]
    );

    return (
        <div className="layout" style={{ ...controlsCssStyle, ...mapLayoutCssStyle } as React.CSSProperties}>
            <div className="side-panel">
                <div>
                    <label htmlFor="map-width">Width (px)</label>
                    <input type='number' name="map-width" value={mapLayout.width} onChange={(event) => !isNaN(Number(event.target.value)) ? setMapLayout((prev) => ({ ...prev, width: Number(event.target.value) })) : null} />
                </div>
                <div>
                    <label htmlFor="map-height">Height (px)</label>
                    <input type='number' name="map-height" value={mapLayout.height} onChange={(event) => !isNaN(Number(event.target.value)) ? setMapLayout((prev) => ({ ...prev, height: Number(event.target.value) })) : null} />
                </div>
                <div>
                    <label htmlFor="map-border-radius">Radius (px, %)</label>
                    <input type='text' name="map-border-radius" value={mapLayout.borderRadius} onChange={(event) => setMapLayout((prev) => ({ ...prev, borderRadius: event.target.value }))} />
                </div>
                <div>
                    <label htmlFor="map-border-width">Border width (px)</label>
                    <input type='number' name="map-width" value={mapLayout.borderWidth} onChange={(event) => !isNaN(Number(event.target.value)) ? setMapLayout((prev) => ({ ...prev, borderWidth: Number(event.target.value) })) : null} />
                </div>
                <div>
                    <label htmlFor="map-border-color">Border color</label>
                    <input type='color' name="map-border-color" value={mapLayout.borderColor} onChange={(event) => {
                        console.log(event.target.value)
                        setMapLayout((prev) => ({ ...prev, borderColor: event.target.value }));
                    }} />
                </div>
                <div>
                    <label htmlFor="map-border-box-shadow">Box shadow</label>
                    <input type='text' name="map-box-shadow" value={mapLayout.boxShadow} onChange={(event) => setMapLayout((prev) => ({ ...prev, boxShadow: event.target.value }))} />
                </div>

                <hr className="hr" />

                <div>
                    <label htmlFor="controls-position">Controls position</label>
                    <select name="controls-position" value={controlPosition} onChange={(event) => setControlPosition(event.target.value as maplibregl.ControlPosition)}>
                        {controlsPositions.map((el) => <option key={el} value={el} label={el}>{el}</option>)}
                    </select>
                </div>
                {placements.map((el) => {
                    const reverseFactor = el === 'top' || el === 'right' ? -1 : 1;
                    return (
                        <div key={el}>
                            <label htmlFor={`controls-${el}`}>Offset {el} (px)</label>
                            <input
                                type='number'
                                name={`controls-${el}`}
                                value={reverseFactor * controlPlacement[el]}
                                onChange={(event) => setControlPlacement((prev) => !isNaN(Number(event.target.value)) 
                                    ? { ...prev, [el]: reverseFactor * Number(event.target.value) } 
                                    : prev)}
                            />
                        </div>
                    );
                })}
                <div className="checkbox" onClick={() => setShowZoom((prev) => !prev)}>
                    <input
                        type='checkbox'
                        name="controls-zoom"
                        checked={showZoom}
                    />
                    <label htmlFor="controls-zoom">Show zoom buttons</label>
                </div>
                <div className="checkbox" onClick={() => setShowCompass((prev) => !prev)}>
                    <input
                        type='checkbox'
                        name="controls-compass"
                        checked={showCompass}
                    />
                    <label htmlFor="controls-compass">Show compass button</label>
                </div>
            </div>
            <Map
                showZoom={showZoom}
                showCompass={showCompass}
                controlPosition={controlPosition}
            />
        </div>
    );
};
