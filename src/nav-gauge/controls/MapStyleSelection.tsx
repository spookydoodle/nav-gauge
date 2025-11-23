import { FC, useEffect } from "react";
import { useStateWarden } from "../../contexts";
import { Cartographer } from "../../logic/state/cartographer";
import { useSubjectState } from "../../hooks/useSubjectState";
import * as styles from './controls.module.css';

export const MapStyleSelection: FC = () => {
    const { cartographer, attributionVault } = useStateWarden();
    const [selectedStyleId, setSelectedStyleId] = useSubjectState(cartographer.selectedStyleId$)

    const handleMapStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (Cartographer.styles.get(event.target.value)) {
            setSelectedStyleId(event.target.value);
        }
    }

    useEffect(() => {
        const style = Cartographer.styles.get(selectedStyleId);
        if (!style?.attribution) {
            return;
        }
        attributionVault.addEntry(selectedStyleId, style.attribution);

        return () => {
            attributionVault.removeEntry(selectedStyleId);
        };
    }, [selectedStyleId]);

    return (
        <div className={styles['map-style-selection']}>
            {/* TODO: Move to reusable component */}
            <div>
                <label htmlFor="map-style-selection" style={{ fontSize: "12px" }}>Map style</label>
                <select name="map-style-selection" id="map-style-selection" value={selectedStyleId} onChange={handleMapStyleChange}>
                    {[...Cartographer.styles.entries()].map(([id, option]) => (
                        <option key={id} value={id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
