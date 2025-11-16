import { Dispatch, FC, SetStateAction } from "react";
import classNames from "classnames";
import { Fieldset, Input } from "../../components";
import { AnimationControlsType, CameraAngle, cameraAngleOptions, clamp, defaultZoomInToImages, pitchRange, zoomRange } from "../../logic";
import * as styles from './controls.module.css';

interface Props {
    animationControls: AnimationControlsType;
    onAnimationConrolsChange: Dispatch<SetStateAction<AnimationControlsType>>;
}

export const AnimationControls: FC<Props> = ({
    animationControls,
    onAnimationConrolsChange
}) => {
    const {
        cameraAngle,
        followCurrentPoint,
        autoRotate,
        pitch,
        zoom,
        zoomInToImages
    } = animationControls;

    return (
        <Fieldset label="Animation controls">
            <Input
                id="animation-controls-follow-current-point"
                name="animation-controls-follow-current-point"
                label="Follow current point"
                labelPlacement="after"
                type='checkbox'
                checked={followCurrentPoint}
                onChange={() => { }}
                onContainerClick={() => onAnimationConrolsChange((prev) => ({ ...prev, followCurrentPoint: !prev.followCurrentPoint }))}
                containerClassName={styles["checkbox"]}
            />
            <Input
                id="animation-controls-auto-rotate"
                name="animation-controls-auto-rotate"
                label="Auto rotate"
                labelPlacement="after"
                type='checkbox'
                checked={autoRotate}
                onChange={() => { }}
                onContainerClick={() => onAnimationConrolsChange((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
                containerClassName={styles["checkbox"]}
            />
            {/* TODO: Move select to its own component and remove style */}
            <div>
                <label htmlFor="controls-position" style={{ fontSize: '12px' }}>Camera angle</label>
                <select
                    id="animation-controls-camera-angle"
                    name="animation-controls-camera-angle"
                    value={cameraAngle}
                    onChange={(event) => onAnimationConrolsChange((prev) => ({
                        ...prev,
                        cameraAngle: event.target.value as CameraAngle
                    }))}
                >
                    {cameraAngleOptions.map((el) => <option key={el.value} {...el}>{el.label}</option>)}
                </select>
            </div>
            <div className={styles["section"]}>
                <Input
                    id="animation-controls-pitch"
                    name="animation-controls-pitch"
                    label="Pitch"
                    type='number'
                    value={pitch}
                    min={pitchRange[0]}
                    max={pitchRange[1]}
                    onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                        ? { ...prev, pitch: clamp(Number(event.target.value), pitchRange) }
                        : prev)}
                />
                <Input
                    id="animation-controls-zoom"
                    name="animation-controls-zoom"
                    label="Zoom"
                    type='number'
                    value={zoom}
                    min={zoomRange[0]}
                    max={zoomRange[1]}
                    onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                        ? { ...prev, zoom: clamp(Number(event.target.value), zoomRange) }
                        : prev)}
                />
            </div>
            <div className={styles["section"]}>
                <Input
                    id="animation-controls-zoom-in-to-images"
                    name="animation-controls-zoom-in-to-images"
                    label="Zoom in to images"
                    labelPlacement="after"
                    type='checkbox'
                    checked={zoomInToImages !== false}
                    onChange={() => { }}
                    onContainerClick={() => onAnimationConrolsChange((prev) => ({
                        ...prev,
                        zoomInToImages: prev.zoomInToImages === false ? defaultZoomInToImages : false
                    }))}
                    containerClassName={classNames(styles["checkbox"], styles["top-margin"])}
                />
                <Input
                    id="animation-controls-zoom-in-to-images-value"
                    name="animation-controls-zoom-in-to-images-value"
                    label="Zoom in to images"
                    type='number'
                    value={zoomInToImages || zoom}
                    min={zoomRange[0]}
                    max={zoomRange[1]}
                    onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                        ? { ...prev, zoomInToImages: clamp(Number(event.target.value), zoomRange) }
                        : prev)}
                    disabled={zoomInToImages === false}
                />
            </div>
        </Fieldset>
    );
};
