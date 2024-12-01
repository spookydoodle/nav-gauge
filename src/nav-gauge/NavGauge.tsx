import React from "react";
import { Map } from "./Map";
import './nav-gauge.css';

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
                case 'bottom-left': return ['bottom', 'right']
                case 'bottom-right': return ['bottom', 'left']
            }
        },
        [controlPosition, controlPlacement]
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
                {placements.map((el) => (
                    <>
                        <label htmlFor={`controls-${el}`}>{el}</label>
                        <input
                            type='number'
                            name={`controls-${el}`}
                            value={controlPlacement[el]}
                            onChange={(event) => setControlPlacement((prev) => !isNaN(Number(event.target.value)) ? { ...prev, [el]: Number(event.target.value) } : prev)}
                        />
                    </>
                ))}
            </div>
            <Map
                showZoom={showZoom}
                showCompass={showCompass}
                controlPosition={controlPosition}
            />
        </div>
    );
};
