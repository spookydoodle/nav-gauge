import { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from "react";
import { RouteTimes } from "../layers/RouteLayer";
import { ImageData } from "../../parsers";
import * as styles from './player.module.css';

interface Props {
    images: ImageData[];
    progressMs: number;
    onProgressMsChange: React.Dispatch<React.SetStateAction<number>>;
    routeTimes?: RouteTimes;
    isPlaying: boolean;
    onIsPlayingChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Player: FC<Props> = ({
    images,
    progressMs,
    onProgressMsChange,
    routeTimes,
    isPlaying,
    onIsPlayingChange,
}) => {
    const [dragState, setDragState] = useState<{
        type: 'touch' | 'mouse';
        isPlaying: boolean;
        startProgressPercentage: number;
        width: number;
        startClientX: number;
        currentClientX: number;
    } | null>(null);
    const handlePlayClick = () => onIsPlayingChange((prev) => !prev);

    const progressPercentage = useMemo(
        (): number | undefined => {
            if (!routeTimes) {
                return;
            }
            return (progressMs / routeTimes.duration * 100);
        },
        [progressMs, routeTimes?.duration]
    );

    const startDragging = (clientX: number, event: React.MouseEvent | React.TouchEvent) => {
        onIsPlayingChange(false);
        setDragState({
            type: 'mouse',
            isPlaying,
            startProgressPercentage: progressPercentage ?? 0,
            width: event.currentTarget.parentElement?.clientWidth ?? 0,
            startClientX: clientX,
            currentClientX: clientX,
        });
    }

    const drag = (clientX: number) => {
        setDragState((prev) => prev ? { ...prev, currentClientX: clientX } : prev);
    }

    const stopDragging = () => {
        onIsPlayingChange(!!dragState?.isPlaying);
        setDragState(null);
    }

    const handleThumbMouseDown = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        startDragging(event.clientX, event);
    };

    useEffect(() => {
        if (dragState?.type !== 'mouse') {
            return;
        }
        const mouseMoveHandler = (event: MouseEvent) => {
            drag(event.clientX);
        };
        const mouseUpHandler = () => {
            stopDragging();
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

    }, [dragState?.type]);

    const handleThumbTouchStart = (event: React.TouchEvent<HTMLSpanElement>) => {
        startDragging(event.touches[0]?.clientX ?? 0, event);
    };

    useEffect(() => {
        if (dragState?.type !== 'touch') {
            return;
        }
        const touchMoveHander = (event: TouchEvent) => {
            drag(event.touches[0]?.clientX ?? 0);
        };
        const touchEndHandler = () => {
            stopDragging();
            document.removeEventListener('touchmove', touchMoveHander);
            document.removeEventListener('touchend', touchEndHandler);
        };
        document.addEventListener('touchmove', touchMoveHander);
        document.addEventListener('touchend', touchEndHandler);

        return () => {
            document.removeEventListener('touchmove', touchMoveHander);
            document.removeEventListener('touchend', touchEndHandler);
        };
    }, [dragState?.type]);

    useEffect(() => {
        if (!dragState || !routeTimes) {
            return;
        }
        onProgressMsChange((prev) => {
            const diffPercentage = Number(((dragState.currentClientX - dragState.startClientX) / dragState.width * 100).toFixed(0));
            const nextPercentage = dragState.startProgressPercentage + diffPercentage;
            const clampedPercentage = (Math.max(0, Math.min(100, nextPercentage)));
            return (clampedPercentage / 100) * routeTimes.duration;
        });
    }, [dragState?.currentClientX]);

    return (
        <div className={styles.player}>
            <div className={styles.pictures}>

            </div>
            <div className={styles.slider} style={{
                '--track-complete': `${progressPercentage ?? 0}%`
            } as CSSProperties}>
                <span className={styles.thumb} onMouseDown={handleThumbMouseDown} onTouchStart={e => handleThumbTouchStart} />
            </div>
            <div className={styles.buttons}>
                <p className={styles.text}>
                    {progressPercentage !== undefined ? `${progressPercentage.toFixed(0)}%` : '-'}
                </p>
                <button onClick={handlePlayClick}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>
        </div>
    );
};
