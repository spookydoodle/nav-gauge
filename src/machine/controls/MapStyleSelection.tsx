import { FC, useEffect } from "react";
import { Cartomancer, useStateWarden } from "../../apparatus";
import { useSubjectState } from "../hooks";
import * as styles from './controls.module.css';

export const MapStyleSelection: FC = () => {
    const { cartomancer, attributionVault } = useStateWarden();
    const [selectedStyleId, setSelectedStyleId] = useSubjectState(cartomancer.selectedStyleId$)

    const handleMapStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (Cartomancer.styles.get(event.target.value)) {
            setSelectedStyleId(event.target.value);
        }
    }

    useEffect(() => {
        const style = Cartomancer.styles.get(selectedStyleId);
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
                    {[...Cartomancer.styles.entries()].map(([id, option]) => (
                        <option key={id} value={id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
