import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import classNames from "classnames";
import { ToolPanelProps, useMultipleTranslations } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { clamp, useSubjectState } from "@tinker-chest";
import { ClockInput, Checkbox, Fieldset, ClockSliceInput, DurationClockInput, IconRotateInput, Slider, ToggleSwitch, Label, Span, Icon } from "@web-ui";
import { AnimationControlsType, Animatrix } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons, millisecondsToDurationParts } from "@ui";
import { WebRouteStoryProps } from "../model";
import styles from './animation-controls.module.css';

const pad2 = (value: number): string => String(value).padStart(2, '0');

const formatDuration = (milliseconds: number): string => {
    const { minutes, seconds } = millisecondsToDurationParts(milliseconds);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
        return `${pad2(hours)}:${pad2(remainingMinutes)}:${pad2(seconds)}`;
    }
    if (remainingMinutes > 0) {
        return `${pad2(remainingMinutes)}:${pad2(seconds)}`;
    }
    return String(seconds);
};

export const AnimationControls: FC<ToolPanelProps<maplibregl.Map> & WebRouteStoryProps> = ({
    map,
    animatrix,
    placement,
    images$,
}) => {
    const { chronoLens } = useWebMachineWard();
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls, setAnimationControls] = useSubjectState(animatrix.controls$);
    const [searchQuery] = useSubjectState(animatrix.searchQuery$);
    const [images] = useSubjectState(images$);

    const [
        generalLabel,
        followCurrentPointLabel,
        autoRotateLabel,
        cameraAngleLabel,
        cameraRollLabel,
        pitchLabel,
        zoomLabel,
        imagePauseDurationLabel,
        routePlaybackDurationLabel,
        totalRecordingDurationLabel,
        easeDurationLabel,
        panToWholeRouteAtEndLabel,
    ] = useMultipleTranslations([
        { n: animatrix.namespace, t: animatrix.translationKey.General },
        { n: animatrix.namespace, t: animatrix.translationKey.FollowCurrentPoint },
        { n: animatrix.namespace, t: animatrix.translationKey.AutoRotate },
        { n: animatrix.namespace, t: animatrix.translationKey.CameraAngle },
        { n: animatrix.namespace, t: animatrix.translationKey.CameraRoll },
        { n: animatrix.namespace, t: animatrix.translationKey.Pitch },
        { n: animatrix.namespace, t: animatrix.translationKey.Zoom },
        { n: animatrix.namespace, t: animatrix.translationKey.ImagePauseDuration },
        { n: animatrix.namespace, t: animatrix.translationKey.RoutePlaybackDuration },
        { n: animatrix.namespace, t: animatrix.translationKey.TotalRecordingDuration },
        { n: animatrix.namespace, t: animatrix.translationKey.EaseDuration },
        { n: animatrix.namespace, t: animatrix.translationKey.PanToWholeRouteAtEnd },
    ]);

    const matchesSearch = (label: string): boolean => {
        if (!searchQuery) {
            return true;
        }
        return label.toLowerCase().includes(searchQuery.toLowerCase());
    };

    const showGeneral = matchesSearch(generalLabel)
        || matchesSearch(imagePauseDurationLabel)
        || matchesSearch(routePlaybackDurationLabel)
        || matchesSearch(totalRecordingDurationLabel)
        || matchesSearch(panToWholeRouteAtEndLabel);

    const showFollowCurrentPoint = matchesSearch(followCurrentPointLabel)
        || matchesSearch(zoomLabel)
        || matchesSearch(easeDurationLabel)
        || matchesSearch(cameraAngleLabel)
        || matchesSearch(cameraRollLabel)
        || matchesSearch(pitchLabel)
        || matchesSearch(autoRotateLabel);

    const {
        followCurrentPoint,
        autoRotate,
        cameraAngle,
        cameraRoll,
        cameraTilt,
        cameraZoom,
        easeDuration,
        displayImageDuration,
        routePlaybackDuration,
        panToWholeRouteAtEnd,
    } = animationControls;

    const displayedImageCount = images.filter((image) => image.featureId !== undefined).length;
    const totalRecordingDuration = routePlaybackDuration + displayedImageCount * displayImageDuration;

    return (
        <div className={classNames(styles['container'], styles[placement])}>
            {showGeneral && (
                <Fieldset label={generalLabel} expandable contentClassName={styles['fieldset']}>
                    <Label htmlFor="animation-controls-image-pause-duration" align="right">
                        {imagePauseDurationLabel}
                    </Label>
                    <ClockInput
                        id="animation-controls-image-pause-duration"
                        variant="fill-inverse"
                        value={displayImageDuration / 1000 * 6}
                        formatValue={(angle) => `${Math.round(angle / 6)}s`}
                        min={Animatrix.displayImageDurationRange[0] / 1000 * 6}
                        max={Animatrix.displayImageDurationRange[1] / 1000 * 6}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, displayImageDuration: clamp(value * 1000 / 6, Animatrix.displayImageDurationRange)
                        }))}
                    />
                    <Span tabular>{Math.round(displayImageDuration / 1000)}s</Span>
                    <Label htmlFor="animation-controls-route-playback-duration" align="right">
                        {routePlaybackDurationLabel}
                    </Label>
                    <DurationClockInput
                        id="animation-controls-route-playback-duration"
                        value={routePlaybackDuration}
                        min={Animatrix.routePlaybackDurationRange[0]}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, routePlaybackDuration: value
                        }))}
                    />
                    <Span tabular>
                        {String(millisecondsToDurationParts(routePlaybackDuration).minutes).padStart(2, '0')}
                        :
                        {String(millisecondsToDurationParts(routePlaybackDuration).seconds).padStart(2, '0')}
                    </Span>
                    <Label htmlFor="animation-controls-total-recording-duration" align="right">
                        {totalRecordingDurationLabel}
                    </Label>
                    <div className={styles['recording-formula']}>
                        <Span tabular>{formatDuration(routePlaybackDuration)}</Span>
                        <span className={styles['recording-formula-operator']}>+</span>
                        <Icon src={Icons.NounProject.ImageMarker} width={13} height={13} />
                        <Span tabular>{`${displayedImageCount} × ${formatDuration(displayImageDuration)}`}</Span>
                        <span className={styles['recording-formula-equals']}>= {formatDuration(totalRecordingDuration)}</span>
                    </div>
                    <span />
                    <Checkbox
                        id="animation-controls-pan-to-whole-route-at-end"
                        checked={panToWholeRouteAtEnd}
                        size="sm"
                        onChange={() => setAnimationControls((prev) => ({ ...prev, panToWholeRouteAtEnd: !prev.panToWholeRouteAtEnd }))}
                    >
                        {panToWholeRouteAtEndLabel}
                    </Checkbox>
                    <span />
                </Fieldset>
            )}
            {showFollowCurrentPoint && (
                <Fieldset
                    label={followCurrentPointLabel}
                    append={
                        <ToggleSwitch
                            id="animation-controls-follow-current-point"
                            aria-label={followCurrentPointLabel}
                            checked={followCurrentPoint}
                            onChange={() => setAnimationControls((prev) => ({ ...prev, followCurrentPoint: !prev.followCurrentPoint }))}
                            size="sm"
                        />
                    }
                    expandable
                    contentClassName={classNames(styles['fieldset'], styles['top-padding'])}
                >
                    {matchesSearch(zoomLabel) && (
                        <>
                            <Label htmlFor="animation-controls-zoom" align="right">
                                {zoomLabel}
                            </Label>
                            <Slider
                                id="animation-controls-zoom"
                                value={cameraZoom}
                                step={0.1}
                                min={Animatrix.zoomRange[0]}
                                max={Animatrix.zoomRange[1]}
                                onChange={(value) => {
                                    setAnimationControls((prev) => ({
                                        ...prev, cameraZoom: clamp(value, Animatrix.zoomRange)
                                    }));
                                    if (!isPlaying) {
                                        map.setZoom(value);
                                    }
                                }}
                                size="xs"
                                disabled={!followCurrentPoint}
                            />
                            <Span tabular>{cameraZoom.toFixed(1)}</Span>
                        </>
                    )}
                    {matchesSearch(easeDurationLabel) && (
                        <>
                            <Label htmlFor="animation-controls-ease-duration" align="right">
                                {easeDurationLabel}
                            </Label>
                            <Slider
                                id="animation-controls-ease-duration"
                                value={easeDuration}
                                min={Animatrix.easeDurationRange[0]}
                                max={Animatrix.easeDurationRange[1]}
                                step={100}
                                onChange={(value) => setAnimationControls((prev) => ({
                                    ...prev, easeDuration: clamp(value, Animatrix.easeDurationRange)
                                }))}
                                size="xs"
                                disabled={!followCurrentPoint}
                            />
                            <Span tabular>{easeDuration}ms</Span>
                        </>
                    )}
                    {matchesSearch(autoRotateLabel) && (
                        <>
                            <span />
                            <Checkbox
                                id="animation-controls-auto-rotate"
                                checked={autoRotate}
                                size="sm"
                                onChange={() => setAnimationControls((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
                                disabled={!followCurrentPoint}
                            >
                                {autoRotateLabel}
                            </Checkbox>
                            <span />
                        </>
                    )}
                    {matchesSearch(cameraAngleLabel) && (
                        <>
                            <Label htmlFor="animation-controls-camera-angle" align="right">
                                {cameraAngleLabel}
                            </Label>
                            <IconRotateInput
                                id="animation-controls-camera-angle"
                                valueAdjustment={-90}
                                icon={Icons.NounProject.CameraVideoSide}
                                size='sm'
                                value={cameraAngle}
                                min={Animatrix.cameraAngleRange[0]}
                                max={Animatrix.cameraAngleRange[1]}
                                onChange={(value) => setAnimationControls((prev) => ({
                                    ...prev, cameraAngle: clamp(value, Animatrix.cameraAngleRange)
                                }))}
                                disabled={!followCurrentPoint}
                            />
                            <Span tabular>{cameraAngle}°</Span>
                        </>
                    )}
                    {matchesSearch(pitchLabel) && (
                        <>
                            <Label htmlFor="animation-controls-pitch" align="right">
                                {pitchLabel}
                            </Label>
                            <ClockSliceInput
                                id="animation-controls-pitch"
                                thumbIcon={Icons.NounProject.CameraVideoSide}
                                size='xs'
                                value={cameraTilt}
                                min={Animatrix.cameraTiltRange[0]}
                                max={Animatrix.cameraTiltRange[1]}
                                onChange={(value) => {
                                    setAnimationControls((prev): AnimationControlsType => ({
                                        ...prev, cameraTilt: clamp(value, Animatrix.cameraTiltRange)
                                    }));
                                    if (!isPlaying) {
                                        map.setPitch(value);
                                    }
                                }}
                                disabled={!followCurrentPoint}
                            />
                            <Span tabular>{cameraTilt}°</Span>
                        </>
                    )}
                    {matchesSearch(cameraRollLabel) && (
                        <>
                            <Label htmlFor="animation-controls-camera-roll" align="right">
                                {cameraRollLabel}
                            </Label>
                            <IconRotateInput
                                id="animation-controls-camera-roll"
                                icon={Icons.NounProject.CameraVideoFront}
                                size='sm'
                                value={cameraRoll}
                                min={Animatrix.cameraRollRange[0]}
                                max={Animatrix.cameraRollRange[1]}
                                onChange={(value) => {
                                    setAnimationControls((prev) => ({
                                        ...prev, cameraRoll: clamp(value, Animatrix.cameraRollRange)
                                    }));
                                    if (!isPlaying) {
                                        map.setRoll(value);
                                    }
                                }}
                                disabled={!followCurrentPoint}
                            />
                            <Span tabular>{cameraRoll}°</Span>
                        </>
                    )}
                </Fieldset>
            )}
        </div>
    );
};
