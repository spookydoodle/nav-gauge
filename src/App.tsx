import { FC, StrictMode, useEffect } from "react";
import { TopBar, Footer } from "./layout";
import { NavGauge } from "./nav-gauge/NavGauge";
import { useLocalStorageState } from "./hooks";
import { ApplicationSettingsType, defaultApplicationSettings } from "./logic";
import { theOneAndOnlyStateWarden, StateWardenContext } from "./contexts";
import './app.css';
import "./themes.css";

const App: FC = () => {
    const [applicationSettings, setApplicationSettings] = useLocalStorageState<ApplicationSettingsType>('application-settings', defaultApplicationSettings);

    useEffect(() => {
        document.body.setAttribute("data-theme", applicationSettings.theme);
    }, [applicationSettings.theme]);

    return (
        <StrictMode>
            <StateWardenContext.Provider value={theOneAndOnlyStateWarden}>
                <TopBar />
                <NavGauge applicationSettings={applicationSettings} onApplicationSettingsChange={setApplicationSettings} />
                <Footer />
            </StateWardenContext.Provider>
        </StrictMode>
    );
}

export default App;
