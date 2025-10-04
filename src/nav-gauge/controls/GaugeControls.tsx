import { Dispatch, FC, SetStateAction, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { Input } from "../../components";
import * as styles from './controls.module.css';

const controlsPositions: maplibregl.ControlPosition[] = ["top-left", "top-right", "bottom-left", "bottom-right"];

export interface ControlPlacement {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface GaugeControls {
    globeProjection: boolean;
    showZoom: boolean;
    showCompass: boolean;
    showGreenScreen: boolean;
    controlPosition: maplibregl.ControlPosition;
    controlPlacement: ControlPlacement;
    showRouteLine: boolean;
    showRoutePoints: boolean;
}

export const defaultGaugeControls: GaugeControls = {
    globeProjection: true,
    showZoom: false,
    showCompass: true,
    showGreenScreen: false,
    controlPosition: 'top-right',
    controlPlacement: { top: 0, bottom: 0, left: 0, right: 0 },
    showRouteLine: true,
    showRoutePoints: true,
}

interface Props {
    gaugeControls: GaugeControls;
    onGaugeConrolsChange: Dispatch<SetStateAction<GaugeControls>>;
}

export const GaugeControls: FC<Props> = ({
    gaugeControls,
    onGaugeConrolsChange
}) => {
    const {
        globeProjection,
        showZoom,
        showCompass,
        showGreenScreen,
        controlPosition,
        controlPlacement,
        showRouteLine,
        showRoutePoints,
    } = gaugeControls;

    const placements = useMemo(
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

    return (
        <>
            <div>
                <label htmlFor="controls-position">Controls position</label>
                <select
                    id="controls-position"
                    name="controls-position"
                    value={controlPosition}
                    onChange={(event) => onGaugeConrolsChange((prev) => ({
                        ...prev,
                        controlPosition: event.target.value as maplibregl.ControlPosition
                    }))}
                >
                    {controlsPositions.map((el) => <option key={el} value={el} label={el}>{el}</option>)}
                </select>
            </div>
            <div className={styles["section"]}>
                {placements.map((el) => {
                    const reverseFactor = ['top', 'right'].includes(el) ? -1 : 1;
                    return (
                        <Input
                            key={el}
                            id={`controls-${el}`}
                            name={`controls-${el}`}
                            label={`Offset ${el} (px)`}
                            type='number'
                            value={reverseFactor * controlPlacement[el]}
                            onChange={(event) => onGaugeConrolsChange((prev) => !isNaN(Number(event.target.value))
                                ? {
                                    ...prev,
                                    controlPlacement: { ...prev.controlPlacement, [el]: reverseFactor * Number(event.target.value) }
                                }
                                : prev)}
                        />
                    );
                })}
            </div>

            <Input
                id="controls-zoom"
                name="controls-zoom"
                label="Globe view"
                labelPlacement="after"
                type='checkbox'
                checked={globeProjection}
                onChange={() => {}}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, globeProjection: !prev.globeProjection }))}
                containerClassName={styles["checkbox"]}
            />
            <Input
                id="controls-zoom"
                name="controls-zoom"
                label="Show zoom buttons"
                labelPlacement="after"
                type='checkbox'
                checked={showZoom}
                onChange={() => {}}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, showZoom: !prev.showZoom }))}
                containerClassName={styles["checkbox"]}
            />
            <Input
                id="controls-compass"
                name="controls-compass"
                label="Show compass button"
                labelPlacement="after"
                type='checkbox'
                checked={showCompass}
                onChange={() => {}}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, showCompass: !prev.showCompass }))}
                containerClassName={styles["checkbox"]}
            />
            <Input
                id="green-screen"
                name="green-screen"
                label="Show green screen"
                labelPlacement="after"
                type='checkbox'
                checked={showGreenScreen}
                onChange={() => {}}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, showGreenScreen: !prev.showGreenScreen }))}
                containerClassName={styles["checkbox"]}
            />
            <Input
                id="route-line"
                name="route-line"
                label="Show route line"
                labelPlacement="after"
                type='checkbox'
                checked={showRouteLine}
                onChange={() => {}}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, showRouteLine: !prev.showRouteLine }))}
                containerClassName={styles["checkbox"]}
            />
            <Input
                id="route-points"
                name="route-points"
                label="Show route points"
                labelPlacement="after"
                type='checkbox'
                checked={showRoutePoints}
                onChange={() => {}}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, showRoutePoints: !prev.showRoutePoints }))}
                containerClassName={styles["checkbox"]}
            />
        </>
    );
};
