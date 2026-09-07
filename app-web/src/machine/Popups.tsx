import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { useSubjectState } from "@tinker-chest";
import { useWebMachineWard } from "@web-apparatus";

interface Props {
    map?: maplibregl.Map;
}

export const Popups: FC<Props> = ({ map }) => {
    const { toolsStation } = useWebMachineWard();
    const [toolPopups] = useSubjectState(toolsStation.toolPopups$);

    return (
        <>
            {[...toolPopups.entries()].map(([id, popup]) => (
                <popup.contentComponent key={id} map={map} onClose={popup.onClose} />
            ))}
        </>
    );
};
