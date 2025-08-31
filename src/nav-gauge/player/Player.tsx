import { FC, useCallback, useMemo } from "react";
import styles from './player.module.css';
import { RouteTimes } from "../layers/RouteLayer";

interface Props {
    progressMs: number;
    routeTimes?: RouteTimes;
    isPlaying: boolean;
    onIsPlayingChange: React.Dispatch<React.SetStateAction<boolean>>;
    onStop: () => void;
}

export const Player: FC<Props> = ({
    progressMs,
    routeTimes,
    isPlaying,
    onIsPlayingChange,
    onStop
}) => {
    const handlePlayClick = useCallback(
        () => onIsPlayingChange((prev) => !prev),
        []
    );

    const handleStop = useCallback(
        () => {
            onIsPlayingChange(false);
            onStop();
        },
        [onIsPlayingChange, onStop]
    );

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
