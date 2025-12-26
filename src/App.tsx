import { FC, StrictMode, useEffect } from "react";
import { useLocalStorageState, theOneAndOnlyStateWarden, StateWardenContext } from "@apparatus";
import { ApplicationSettingsType, defaultApplicationSettings } from "@tinker-chest";
import { routeGear } from "@gears";
import { TopBar, Footer } from "./app/layout";
import { Machine } from "./app/machine/Machine";
import './app.css';
import "./themes.css";

export const App: FC = () => {
    const [applicationSettings, setApplicationSettings] = useLocalStorageState<ApplicationSettingsType>('application-settings', defaultApplicationSettings);

    useEffect(() => {
        document.body.setAttribute("data-theme", applicationSettings.theme);
    }, [applicationSettings.theme]);

    useEffect(() => {
        theOneAndOnlyStateWarden.engine.addGear(routeGear);

        return () => {
            theOneAndOnlyStateWarden.engine.removeGear(routeGear.id);
        };
    }, []);

    return (
        <StrictMode>
            <StateWardenContext.Provider value={theOneAndOnlyStateWarden}>
                <TopBar />
                <Machine applicationSettings={applicationSettings} onApplicationSettingsChange={setApplicationSettings} />
                <Footer />
            </StateWardenContext.Provider>
        </StrictMode>
    );
};
