import { FC } from "react";
import styles from './player.module.css';

export const Player: FC = () => {
    return (
        <div className={styles.player}>
            <button>play</button>
            <button>play</button>
            <button>play</button>
        </div>
    );
};
