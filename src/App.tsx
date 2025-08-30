import { FC, StrictMode } from "react";
import { NavGauge } from "./nav-gauge/NavGauge";
import styles from './app.module.css';

const App: FC = () => {
    return (
        <StrictMode>
            <nav className={styles["navbar"]}>
                <span>nav gauge</span>
            </nav>
            <NavGauge />
            <footer className={styles["footer"]}>
                <a target="_blank" rel="noreferrer" href="https://openstreetmap.org/copyright">
                    © OpenStreetMap
                </a>
            </footer>
        </StrictMode>
    );
}

export default App;
