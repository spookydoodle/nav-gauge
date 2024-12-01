import React from "react";
import maplibregl from "maplibre-gl";
import { Map } from "./Map";
import './nav-gauge.css';

const controlsPositions: maplibregl.ControlPosition[] = ["top-left", "top-right", "bottom-left", "bottom-right"];

interface ControlPlacement {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export const NavGauge: React.FC = () => {
    const [showZoom, setShowZoom] = React.useState(true);
    const [showCompass, setShowCompass] = React.useState(true);
    const [controlPosition, setControlPosition] = React.useState<maplibregl.ControlPosition>('top-right');
    const [controlPlacement, setControlPlacement] = React.useState<ControlPlacement>({ top: 0, bottom: 0, left: 0, right: 0 });

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

    return (
        <div className="layout" style={controlsCssStyle as React.CSSProperties}>
            <div className="side-panel">
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
