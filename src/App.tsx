import { FC, StrictMode, useEffect } from "react";
import { TopBar, Footer } from "./layout";
import { Hub } from "./hub/Hub";
import { useLocalStorageState } from "./hooks";
import { ApplicationSettingsType, defaultApplicationSettings } from "./tinker-chest";
import { theOneAndOnlyStateWarden, StateWardenContext } from "./contexts";
import './app.css';
import "./themes.css";

export const App: FC = () => {
    const [applicationSettings, setApplicationSettings] = useLocalStorageState<ApplicationSettingsType>('application-settings', defaultApplicationSettings);

    useEffect(() => {
        document.body.setAttribute("data-theme", applicationSettings.theme);
    }, [applicationSettings.theme]);

    return (
        <StrictMode>
            <StateWardenContext.Provider value={theOneAndOnlyStateWarden}>
                <TopBar />
                <Hub applicationSettings={applicationSettings} onApplicationSettingsChange={setApplicationSettings} />
                <Footer />
            </StateWardenContext.Provider>
        </StrictMode>
    );
};
