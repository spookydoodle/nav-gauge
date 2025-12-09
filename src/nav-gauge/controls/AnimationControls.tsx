import { Dispatch, FC, SetStateAction } from "react";
import classNames from "classnames";
import { Fieldset, Input } from "../../components";
import { AnimationControlsType, clamp, defaultZoomInToImages, easeDurationRange, pitchRange, cameraRollRange, speedMultiplierRange, zoomRange, cameraAngleRange, bearingLineLengthInMetersRange, maxBearingDiffPerFrameRange } from "../../logic";
import * as styles from './controls.module.css';
import { Animatrix } from "../../logic/state/animatrix";

interface Props {
    animationControls: AnimationControlsType;
    onAnimationConrolsChange: Dispatch<SetStateAction<AnimationControlsType>>;
}

export const AnimationControls: FC<Props> = ({
    animationControls,
    onAnimationConrolsChange
}) => {
    const {
        followCurrentPoint,
        autoRotate,
        cameraAngle,
        cameraRoll,
        bearingLineLengthInMeters,
        maxBearingDiffPerFrame,
        pitch,
        zoom,
        zoomInToImages,
        displayImageDuration,
        speedMultiplier,
        easeDuration
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
            {followCurrentPoint ? (
                <div className={styles["section"]}>
                    <Input
                        id="animation-controls-auto-rotate"
                        name="animation-controls-auto-rotate"
                        label="Auto rotate"
                        labelPlacement="after"
                        type='checkbox'
                        checked={autoRotate}
                        onChange={() => { }}
                        onContainerClick={() => onAnimationConrolsChange((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
                        containerClassName={classNames(styles["checkbox"], styles["top-margin"])}
                    />
                    <div />
                    <Input
                        id="animation-controls-camera-angle"
                        name="animation-controls-camera-angle"
                        label="Camera angle"
                        type='number'
                        value={cameraAngle}
                        min={cameraAngleRange[0]}
                        max={cameraAngleRange[1]}
                        onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, cameraAngle: clamp(Number(event.target.value), cameraAngleRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-camera-roll"
                        name="animation-controls-camera-roll"
                        label="Camera roll"
                        type='number'
                        value={cameraRoll}
                        min={cameraRollRange[0]}
                        max={cameraRollRange[1]}
                        onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, cameraRoll: clamp(Number(event.target.value), cameraRollRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-bearing-line-length-in-meters"
                        name="animation-controls-bearing-line-length-in-meters"
                        label="Bearing line length in meters roll"
                        type='number'
                        value={bearingLineLengthInMeters}
                        min={bearingLineLengthInMetersRange[0]}
                        max={bearingLineLengthInMetersRange[1]}
                        onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, bearingLineLengthInMeters: clamp(Number(event.target.value), bearingLineLengthInMetersRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-max-bearing-diff-per-frame"
                        name="animation-controls-max-bearing-diff-per-frame"
                        label="Max bearing diff per frame"
                        type='number'
                        value={maxBearingDiffPerFrame}
                        min={maxBearingDiffPerFrameRange[0]}
                        max={maxBearingDiffPerFrameRange[1]}
                        onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, maxBearingDiffPerFrame: clamp(Number(event.target.value), maxBearingDiffPerFrameRange) }
                            : prev)}
                    />
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
                    <Input
                        id="animation-controls-image-pause-duration"
                        name="animation-controls-image-pause-duration"
                        label="Image pause duration (ms)"
                        type='number'
                        value={displayImageDuration}
                        min={Animatrix.displayImageDurationRange[0]}
                        max={Animatrix.displayImageDurationRange[1]}
                        step={500}
                        onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, displayImageDuration: clamp(Number(event.target.value), Animatrix.displayImageDurationRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-speed-multiplier"
                        name="animation-controls-speed-multiplier"
                        label="Speed multiplier"
                        type='number'
                        value={speedMultiplier}
                        min={speedMultiplierRange[0]}
                        max={speedMultiplierRange[1]}
                        onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, speedMultiplier: clamp(Number(event.target.value), speedMultiplierRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-ease-duration"
                        name="animation-controls-ease-duration"
                        label="Ease duration"
                        type='number'
                        value={easeDuration}
                        min={easeDurationRange[0]}
                        max={easeDurationRange[1]}
                        onChange={(event) => onAnimationConrolsChange((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, easeDuration: clamp(Number(event.target.value), easeDurationRange) }
                            : prev)}
                    />
                </div>
            ) : null}
        </Fieldset>
    );
};
