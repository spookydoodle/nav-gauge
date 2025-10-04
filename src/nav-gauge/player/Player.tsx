import { FC, useCallback, useMemo } from "react";
import { RouteTimes } from "../layers/RouteLayer";
import { ImageData } from "../../parsers";
import * as styles from './player.module.css';

interface Props {
    images: ImageData[];
    progressMs: number;
    routeTimes?: RouteTimes;
    isPlaying: boolean;
    onIsPlayingChange: React.Dispatch<React.SetStateAction<boolean>>;
    onStop: () => void;
}

export const Player: FC<Props> = ({
    images,
    progressMs,
    routeTimes,
    isPlaying,
    onIsPlayingChange,
    onStop
}) => {
    const handlePlayClick = () => onIsPlayingChange((prev) => !prev);

    const handleStop = () => {
        onIsPlayingChange(false);
        onStop();
    };

    const progress = useMemo(
        (): string => {
            if (!routeTimes) {
                return '-';
            }
            return (progressMs / routeTimes.duration * 100).toFixed(0) + '%';
        },
        [progressMs, routeTimes?.duration]
    );

    return (
        <div className={styles.player}>
            <button onClick={handleStop}>
                Stop
            </button>
            <button onClick={handlePlayClick}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <p className={styles.text}>
                {progress}
            </p>
        </div>
    );
};
