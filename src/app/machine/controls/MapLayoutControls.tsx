import { Dispatch, FC, SetStateAction } from "react";
import { MapLayout } from "@tinker-chest";
import { Fieldset, Input, TextArea } from "@ui";
import * as styles from './controls.module.css';

interface Props {
    mapLayout: MapLayout;
    onMapLayoutChange: Dispatch<SetStateAction<MapLayout>>;
}

export const MapLayoutControls: FC<Props> = ({
    mapLayout,
    onMapLayoutChange,
}) => {
    return (
        <Fieldset label="Map layout">
            <div className={styles["section"]}>
                <Input
                    id="map-size"
                    name="map-size"
                    label="Full screen"
                    labelPlacement="after"
                    type='checkbox'
                    checked={mapLayout.size.type === 'full-screen'}
                    onChange={() => { }}
                    onContainerClick={() => onMapLayoutChange((prev) => ({
                        ...prev, size: {
                            ...prev.size,
                            type: prev.size.type === 'full-screen'
                                ? 'manual'
                                : 'full-screen'
                        }
                    }))}
                    containerClassName={styles["checkbox"]}
                />
                <div />
                <Input
                    id="map-width"
                    name="map-width"
                    label="Width (px)"
                    type='number'
                    disabled={mapLayout.size.type === 'full-screen'}
                    autoSelect
                    min={0}
                    value={mapLayout.size.width}
                    onChange={(event) => {
                        if (!isNaN(Number(event.target.value))) {
                            onMapLayoutChange((prev): MapLayout => ({
                                ...prev,
                                size: {
                                    ...prev.size,
                                    width: Number(event.target.value)
                                }
                            }))
                        }
                    }}
                />
                <Input
                    id="map-height"
                    name="map-height"
                    label="Height (px)"
                    type='number'
                    disabled={mapLayout.size.type === 'full-screen'}
                    autoSelect
                    min={0}
                    value={mapLayout.size.height}
                    onChange={(event) => {
                        if (!isNaN(Number(event.target.value))) {
                            onMapLayoutChange((prev): MapLayout => ({
                                ...prev,
                                size: {
                                    ...prev.size,
                                    height: Number(event.target.value)
                                }
                            }));
                        }
                    }}
                />
                <Input
                    id="map-border-width"
                    name="map-border-width"
                    label="Border width (px)"
                    type='number'
                    autoSelect
                    min={0}
                    value={mapLayout.borderWidth}
                    onChange={(event) => {
                        if (!isNaN(Number(event.target.value))) {
                            onMapLayoutChange((prev) => ({ ...prev, borderWidth: Number(event.target.value) }));
                        }
                    }}
                />
                <Input
                    id="map-inner-border-width"
                    name="map-inner-border-width"
                    label="Inner border width (px)"
                    type='number'
                    autoSelect
                    min={0}
                    value={mapLayout.innerBorderWidth}
                    onChange={(event) => {
                        if (!isNaN(Number(event.target.value))) {
                            onMapLayoutChange((prev) => ({ ...prev, innerBorderWidth: Number(event.target.value) }));
                        }
                    }}
                />
                <Input
                    id="map-border-color"
                    name="map-border-color"
                    label="Border color"
                    type='color'
                    value={mapLayout.borderColor}
                    onChange={(event) => {
                        onMapLayoutChange((prev) => ({ ...prev, borderColor: event.target.value }));
                    }}
                    className={styles["input-color"]}
                />
                <Input
                    id="map-inner-border-color"
                    name="map-inner-border-color"
                    label="Inner border color"
                    type='color'
                    value={mapLayout.innerBorderColor}
                    onChange={(event) => {
                        onMapLayoutChange((prev) => ({ ...prev, innerBorderColor: event.target.value }));
                    }}
                    className={styles["input-color"]}
                />
                <TextArea
                    id="map-border-box-shadow"
                    name="map-border-box-shadow"
                    label="Box shadow"
                    value={mapLayout.boxShadow}
                    onChange={(event) => {
                        onMapLayoutChange((prev) => ({ ...prev, boxShadow: event.target.value }));
                    }}
                    autoSelect
                    className={styles["textarea"]}
                />
                <TextArea
                    id="map-border-inner-box-shadow"
                    name="map-border-inner-box-shadow"
                    label="Inner box shadow"
                    value={mapLayout.innerBoxShadow}
                    onChange={(event) => {
                        onMapLayoutChange((prev) => ({ ...prev, innerBoxShadow: event.target.value }));
                    }}
                    autoSelect
                    className={styles["textarea"]}
                />
                <Input
                    id="map-border-radius"
                    name="map-border-radius"
                    label="Radius (px, %)"
                    type='text'
                    autoSelect
                    value={mapLayout.borderRadius}
                    onChange={(event) => {
                        onMapLayoutChange((prev) => ({ ...prev, borderRadius: event.target.value }));
                    }}
                    className={styles["input-color"]}
                />
            </div>
        </Fieldset>
    );
};
