import { FC, useCallback, useMemo } from "react";
import styles from './player.module.css';

interface Props {
    timeEpoch?: number;
    startTimeEpoch?: number;
    endTimeEpoch?: number;
    isPlaying: boolean;
    onIsPlayingChange: React.Dispatch<React.SetStateAction<boolean>>;
    onStop: () => void;
}

export const Player: FC<Props> = ({
    timeEpoch,
    startTimeEpoch,
    endTimeEpoch,
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

    const currentTime =  useMemo(
        (): string => {
            if (!timeEpoch || !startTimeEpoch || !endTimeEpoch) {
                return '-';
            }
            const total = endTimeEpoch - startTimeEpoch;
            const current = timeEpoch - startTimeEpoch;

            return (current / total * 100).toFixed(0) + '%';
        },
        [timeEpoch, startTimeEpoch, endTimeEpoch]
    );

    return (
        <div className={styles.player}>
            <button onClick={handleStop}>
                Stop
            </button>
            <button onClick={handlePlayClick}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <p className={styles.text}>{currentTime}</p>
        </div>
    );
};
