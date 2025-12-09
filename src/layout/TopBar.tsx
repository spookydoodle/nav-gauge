import { FC } from "react";
import * as styles from './layout.module.css';

export const TopBar: FC = () => {
    return (
        <nav className={styles["navbar"]}>
            <span>nav gauge</span>
        </nav>
    );
}
