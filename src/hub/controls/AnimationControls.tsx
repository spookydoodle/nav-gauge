import { FC } from "react";
import classNames from "classnames";
import { Fieldset, Input } from "../../components";
import {
    clamp,
    defaultZoomInToImages,
} from "../../tinker-chest";
import { useSubjectState } from "../../hooks";
import { useStateWarden } from "../../contexts";
import * as styles from './controls.module.css';
import { Animatrix } from "../../apparatus";

interface Props { }

export const AnimationControls: FC<Props> = () => {
    const { animatrix } = useStateWarden();
    const [animationControls, setAnimationControls] = useSubjectState(animatrix.controls$);
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
                onContainerClick={() => setAnimationControls((prev) => ({ ...prev, followCurrentPoint: !prev.followCurrentPoint }))}
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
                        onContainerClick={() => setAnimationControls((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
                        containerClassName={classNames(styles["checkbox"], styles["top-margin"])}
                    />
                    <div />
                    <Input
                        id="animation-controls-camera-angle"
                        name="animation-controls-camera-angle"
                        label="Camera angle"
                        type='number'
                        value={cameraAngle}
                        min={Animatrix.cameraAngleRange[0]}
                        max={Animatrix.cameraAngleRange[1]}
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, cameraAngle: clamp(Number(event.target.value), Animatrix.cameraAngleRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-camera-roll"
                        name="animation-controls-camera-roll"
                        label="Camera roll"
                        type='number'
                        value={cameraRoll}
                        min={Animatrix.cameraRollRange[0]}
                        max={Animatrix.cameraRollRange[1]}
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, cameraRoll: clamp(Number(event.target.value), Animatrix.cameraRollRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-bearing-line-length-in-meters"
                        name="animation-controls-bearing-line-length-in-meters"
                        label="Bearing line length in meters roll"
                        type='number'
                        value={bearingLineLengthInMeters}
                        min={Animatrix.bearingLineLengthInMetersRange[0]}
                        max={Animatrix.bearingLineLengthInMetersRange[1]}
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, bearingLineLengthInMeters: clamp(Number(event.target.value), Animatrix.bearingLineLengthInMetersRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-max-bearing-diff-per-frame"
                        name="animation-controls-max-bearing-diff-per-frame"
                        label="Max bearing diff per frame"
                        type='number'
                        value={maxBearingDiffPerFrame}
                        min={Animatrix.maxBearingDiffPerFrameRange[0]}
                        max={Animatrix.maxBearingDiffPerFrameRange[1]}
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, maxBearingDiffPerFrame: clamp(Number(event.target.value), Animatrix.maxBearingDiffPerFrameRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-pitch"
                        name="animation-controls-pitch"
                        label="Pitch"
                        type='number'
                        value={pitch}
                        min={Animatrix.pitchRange[0]}
                        max={Animatrix.pitchRange[1]}
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, pitch: clamp(Number(event.target.value), Animatrix.pitchRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-zoom"
                        name="animation-controls-zoom"
                        label="Zoom"
                        type='number'
                        value={zoom}
                        min={Animatrix.zoomRange[0]}
                        max={Animatrix.zoomRange[1]}
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, zoom: clamp(Number(event.target.value), Animatrix.zoomRange) }
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
                        onContainerClick={() => setAnimationControls((prev) => ({
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
                        min={Animatrix.zoomRange[0]}
                        max={Animatrix.zoomRange[1]}
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, zoomInToImages: clamp(Number(event.target.value), Animatrix.zoomRange) }
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
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, displayImageDuration: clamp(Number(event.target.value), Animatrix.displayImageDurationRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-speed-multiplier"
                        name="animation-controls-speed-multiplier"
                        label="Speed multiplier"
                        type='number'
                        value={speedMultiplier}
                        min={Animatrix.speedMultiplierRange[0]}
                        max={Animatrix.speedMultiplierRange[1]}
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, speedMultiplier: clamp(Number(event.target.value), Animatrix.speedMultiplierRange) }
                            : prev)}
                    />
                    <Input
                        id="animation-controls-ease-duration"
                        name="animation-controls-ease-duration"
                        label="Ease duration"
                        type='number'
                        value={easeDuration}
                        min={Animatrix.easeDurationRange[0]}
                        max={Animatrix.easeDurationRange[1]}
                        onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                            ? { ...prev, easeDuration: clamp(Number(event.target.value), Animatrix.easeDurationRange) }
                            : prev)}
                    />
                </div>
            ) : null}
        </Fieldset>
    );
};
