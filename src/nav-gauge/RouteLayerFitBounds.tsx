import { FC, useEffect } from "react";
import { useMap } from "../map/useMap";
import findIcon from '../icons/find.svg';
import './route-layer.css';

interface Props {
    boundingBox?: GeoJSON.BBox;
    /**
     * Defaults to `50`.
     */
    padding?: number;
    /**
     * Defaults to `true`.
     */
    animate?: boolean;
}


export const RouteLayerFitBounds: FC<Props> = ({
    boundingBox,
    padding = 50,
    animate = true,
}) => {
    const { map } = useMap();

    useEffect(() => {
        handlePanTo();
    }, [boundingBox]);

    const handlePanTo = () => {
        if (!boundingBox) {
            return;
        }

        map.fitBounds(
            [boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]],
            { animate, padding }
        );
    };

    return (
        <button
            aria-label="Pan to route"
            title="Pan to route"
            onClick={handlePanTo}
            className="zoom-button"
        >
            <img src={findIcon} width={20} />
        </button>
    );
};
