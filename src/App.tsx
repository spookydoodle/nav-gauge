import { FC, StrictMode, useEffect } from "react";
import { NavGauge } from "./nav-gauge/NavGauge";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { ApplicationSettingsType, defaultApplicationSettings } from "./logic";
import * as styles from './app.module.css';

const App: FC = () => {
    const [applicationSettings, setApplicationSettings] = useLocalStorageState<ApplicationSettingsType>('application-settings', defaultApplicationSettings);

    useEffect(() => {
        document.body.setAttribute("data-theme", applicationSettings.theme);
    }, [applicationSettings.theme]);

    return (
        <StrictMode>
            <nav className={styles["navbar"]}>
                <span>nav gauge</span>
            </nav>
            <NavGauge applicationSettings={applicationSettings} onApplicationSettingsChange={setApplicationSettings} />
            <footer className={styles["footer"]}>
                <a target="_blank" rel="noreferrer" href="https://openstreetmap.org/copyright">
                    © OpenStreetMap
                </a>
            </footer>
        </StrictMode>
    );
}

export default App;
