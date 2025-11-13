import { Dispatch, FC, SetStateAction } from "react";
import { Fieldset, Input } from "../../components";
import { ApplicationSettingsType } from "../../logic";
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
        </Fieldset>
    );
};
