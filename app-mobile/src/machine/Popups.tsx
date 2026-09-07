import { FC } from "react";
import { MobileMap, useMobileMachineWard } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";

interface Props {
    map: MobileMap;
}

export const Popups: FC<Props> = ({ map }) => {
    const { toolsStation } = useMobileMachineWard();
    const [toolPopups] = useSubjectState(toolsStation.toolPopups$);

    return (
        <>
            {[...toolPopups.entries()].map(([id, popup]) => (
                <popup.contentComponent key={id} map={map} onClose={popup.onClose} />
            ))}
        </>
    );
};
