import { Dispatch, FC, SetStateAction } from "react";
import { ApplicationSettingsType } from "../../../../../packages/tinker-chest/src";
import { Fieldset, Input, themeOptions, Theme } from "@ui";
import * as styles from './controls.module.css';

interface Props {
    applicationSettings: ApplicationSettingsType;
    onApplicationSettingsChange: Dispatch<SetStateAction<ApplicationSettingsType>>;
}

export const ApplicationSettings: FC<Props> = ({
    applicationSettings,
    onApplicationSettingsChange,
}) => {
    const { confirmBeforeLeave } = applicationSettings;

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onApplicationSettingsChange((prev) => ({ ...prev, theme: event.target.value as Theme }));
    };

    return (
        <Fieldset label="Application settings">
            <Input
                id="confirm-before-leave"
                name="confirm-before-leave"
                label="Confirm before leave"
                labelPlacement="after"
                type='checkbox'
                checked={confirmBeforeLeave}
                onChange={() => { }}
                onContainerClick={() => onApplicationSettingsChange((prev) => ({ ...prev, confirmBeforeLeave: !prev.confirmBeforeLeave }))}
                containerClassName={styles["checkbox"]}
            />

            {/* TODO: Move to reusable component and remove style */}
            <div>
                <label htmlFor="presets" style={{ fontSize: "12px" }}>Theme</label>
                <select name="presets" id="presets" value={applicationSettings.theme} onChange={handleThemeChange}>
                    {themeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </Fieldset>
    );
};
