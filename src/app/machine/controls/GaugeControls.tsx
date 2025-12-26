import { Dispatch, FC, SetStateAction, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { ControlPlacement, controlsPositions, GaugeControlsType } from "@tinker-chest";
import { Input, Fieldset } from "@ui";
import * as styles from './controls.module.css';

interface Props {
    gaugeControls: GaugeControlsType;
    onGaugeConrolsChange: Dispatch<SetStateAction<GaugeControlsType>>;
}

export const GaugeControls: FC<Props> = ({
    gaugeControls,
    onGaugeConrolsChange
}) => {
    const {
        globeProjection,
        showZoomButtons,
        // TODO: Implement
        showCurrentZoom,
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
        <Fieldset label="Gauge controls">
            {/* TODO: move select  */}
            <div>
                <label htmlFor="controls-position" style={{ fontSize: "12px" }}>Controls position</label>
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
                id="controls-globe-projection"
                name="controls-globe-projection"
                label="Globe view"
                labelPlacement="after"
                type='checkbox'
                checked={globeProjection}
                onChange={() => { }}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, globeProjection: !prev.globeProjection }))}
                containerClassName={styles["checkbox"]}
            />
            <Input
                id="controls-zoom"
                name="controls-zoom"
                label="Show zoom buttons"
                labelPlacement="after"
                type='checkbox'
                checked={showZoomButtons}
                onChange={() => { }}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, showZoomButtons: !prev.showZoomButtons }))}
                containerClassName={styles["checkbox"]}
            />
            <Input
                id="controls-show-current-zoom"
                name="controls-show-current-zoom"
                label="Show current zoom"
                labelPlacement="after"
                type='checkbox'
                checked={showCurrentZoom}
                onChange={() => { }}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, showCurrentZoom: !prev.showCurrentZoom }))}
                containerClassName={styles["checkbox"]}
            />
            <Input
                id="controls-compass"
                name="controls-compass"
                label="Show compass button"
                labelPlacement="after"
                type='checkbox'
                checked={showCompass}
                onChange={() => { }}
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
                onChange={() => { }}
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
                onChange={() => { }}
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
                onChange={() => { }}
                onContainerClick={() => onGaugeConrolsChange((prev) => ({ ...prev, showRoutePoints: !prev.showRoutePoints }))}
                containerClassName={styles["checkbox"]}
            />
        </Fieldset>
    );
};
