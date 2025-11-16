import { CSSProperties, FC } from "react";
import { RouteTimes, GeoJson, ImageData, formatProgressMs, formatTimestamp, getProgressPercentage, getRouteSourceData, updateRouteLayer } from "../../logic";
import * as styles from './player.module.css';
import { useMap } from "../../map/useMap";

interface Props {
    geojson?: GeoJson;
    images: ImageData[];
    progressMs: number;
    onProgressMsChange: React.Dispatch<React.SetStateAction<number>>;
    routeTimes?: RouteTimes;
    isPlaying: boolean;
    onIsPlayingChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Player: FC<Props> = ({
    geojson,
    images,
    progressMs,
    onProgressMsChange,
    routeTimes,
    isPlaying,
    onIsPlayingChange,
}) => {
    const { map } = useMap();
    const handlePlayClick = () => onIsPlayingChange((prev) => !prev);
    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!routeTimes || isNaN(Number(event.target.value))) {
            return;
        }
        onProgressMsChange(Number(event.target.value));
        if (geojson) {
            updateRouteLayer(map, geojson, routeTimes.startTimeEpoch,Number(event.target.value));
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
                <p className={styles.text}>
                    {formatTimestamp(progressMs, routeTimes?.startTimeEpoch)}
                </p>
            </div>
        </div>
    );
};
