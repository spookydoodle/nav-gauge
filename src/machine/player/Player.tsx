import { CSSProperties, FC } from "react";
import { GeoJson, MarkerImage, SurveillanceState } from "../../apparatus";
import { RouteTimes, formatProgressMs, formatTimestamp, getProgressPercentage } from "../../tinker-chest";
import { updateRouteLayer } from "../../gears";
import { useSubjectState } from "../../hooks";
import { useStateWarden } from "../../contexts";
import * as styles from './player.module.css';

interface Props {
    geojson?: GeoJson;
    images: MarkerImage[];
    progressMs: number;
    onProgressMsChange: React.Dispatch<React.SetStateAction<number>>;
    routeTimes?: RouteTimes;
}

export const Player: FC<Props> = ({
    geojson,
    images,
    progressMs,
    onProgressMsChange,
    routeTimes,
}) => {
    const { cartomancer: { map }, animatrix, chronoLens } = useStateWarden();
    const [isPlaying, setIsPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [surveillanceState, setSurveillanceState] = useSubjectState(chronoLens.surveillanceState$);
    const [animationControls] = useSubjectState(animatrix.controls$)
    const { bearingLineLengthInMeters } = animationControls;
    const handlePlayClick = () => setIsPlaying((prev) => !prev);
    const handleRecordClick = () => setSurveillanceState((prev) => prev === SurveillanceState.Stopped
        ? SurveillanceState.InProgress
        : SurveillanceState.Stopped);
    const handleRecordPauseClick = () => setSurveillanceState((prev) => prev === SurveillanceState.Paused
        ? SurveillanceState.InProgress
        : SurveillanceState.Paused);
    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!routeTimes || isNaN(Number(event.target.value))) {
            return;
        }
        // Halt playing animations to allow manual update.
        if (isPlaying) {
            setIsPlaying(false);
        }
        onProgressMsChange(Number(event.target.value));
        if (geojson) {
            updateRouteLayer(map, geojson, routeTimes.startTimeEpoch, Number(event.target.value), bearingLineLengthInMeters);
        }
        // Resume playing animations
        if (isPlaying) {
            setTimeout(() => setIsPlaying(true), 0);
        }
    }

    const getPosition = (featureId: number) => {
        const feature = geojson?.features.find((feature) => feature.properties.id === featureId);
        if (!feature || !routeTimes) {
            return 0;
        }
        return (new Date(feature.properties.time).valueOf() - new Date(routeTimes.startTime).valueOf()) / routeTimes.duration * 100;
    };

    return (
        <div className={styles.player}>
            <div className={styles.pictures}>
                {images
                    .filter((image) => image.featureId !== undefined)
                    .map((image) => (
                        <span key={image.id} className={styles['image-marker']} style={{ left: `${getPosition(image.featureId!).toFixed(0)}%` }} />
                    ))}
            </div>
            <input
                type="range"
                value={progressMs}
                min={0}
                max={routeTimes?.duration ?? 1}
                step={1}
                onChange={handleProgressChange}
                // TODO: Fix styles for all browsers
                // className={styles['progress-slider']}
                style={{
                    '--track-complete': `${progressPercentage}%`
                } as CSSProperties}
            />
            <div className={styles.buttons}>
                <p className={styles.text}>
                    {formatProgressMs(progressMs)} ({progressPercentage.toFixed(0)}%)
                </p>
                <button onClick={handlePlayClick}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={handleRecordClick}>
                    {surveillanceState === SurveillanceState.Stopped ? 'Start' : 'Stop'} recording
                </button>
                {surveillanceState !== SurveillanceState.Stopped ? (
                    <button onClick={handleRecordPauseClick}>
                        {surveillanceState === SurveillanceState.Paused ? 'Resume' : 'Pause'} recording
                    </button>
                ) : null}
                <button onClick={() => chronoLens.cleanup()}>Clear</button>
                <p className={styles.text}>
                    {formatTimestamp(progressMs, routeTimes?.startTimeEpoch)}
                </p>
            </div>
        </div>
    );
};
