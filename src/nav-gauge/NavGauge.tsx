import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import bbox from "@turf/bbox";
import { FileInputStatus } from "../components";
import { defaultMapLayout, MapLayout, MapLayoutControls } from "./controls/MapLayoutControls";
import { defaultGaugeControls, GaugeControls } from "./controls/GaugeControls";
import { MapSection } from "./MapSection";
import { GaugeContext } from "../gauge-settings/gauge-settings";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { parsers } from "../parsers";
import { FileToGeoJSONParser, ParsingResultWithError } from "../parsers";
import * as styles from './nav-gauge.module.css';

export const NavGauge: FC = () => {
    const [{ geojson, boundingBox, routeName, error }, setGeoJson] = useState<ParsingResultWithError>({});
    const [gaugeControls, setGaugeControls] = useLocalStorageState<GaugeControls>('gauge-controls', defaultGaugeControls);
    const [mapLayout, setMapLayout] = useLocalStorageState<MapLayout>('map-layout', defaultMapLayout);

    useEffect(() => {}, [gaugeControls])

    const controlsCssStyle = useMemo(
        () => {
            const { controlPosition, controlPlacement } = gaugeControls;
            
            switch (controlPosition) {
                case 'top-left': return { '--ctrl-top': controlPlacement.top + 'px', '--ctrl-left': controlPlacement.left + 'px' }
                case 'top-right': return { '--ctrl-top': controlPlacement.top + 'px', '--ctrl-right': controlPlacement.right + 'px' }
                case 'bottom-left': return { '--ctrl-bottom': controlPlacement.bottom + 'px', '--ctrl-left': controlPlacement.left + 'px' }
                case 'bottom-right': return { '--ctrl-bottom': controlPlacement.bottom + 'px', '--ctrl-right': controlPlacement.right + 'px' }
            }
        },
        [gaugeControls]
    );

    const mapLayoutCssStyle = useMemo(
        () => ({
            '--map-width': mapLayout.width + 'px',
            '--map-height': mapLayout.height + 'px',
            '--map-border-width': mapLayout.borderWidth + 'px',
            '--map-border-color': mapLayout.borderColor,
            '--map-inner-border-width': mapLayout.innerBorderWidth + 'px',
            '--map-inner-border-color': mapLayout.innerBorderColor,
            '--map-radius': mapLayout.borderRadius,
            '--map-box-shadow': mapLayout.boxShadow,
            '--map-inner-box-shadow': mapLayout.innerBoxShadow,
        }),
        [mapLayout]
    );

    useEffect(() => {
        fetch('/example.gpx')
            .then((file) => file.text())
            .then((text) => parsers.get('.gpx')?.parseTextToGeoJson(text))
            .then((result) => setGeoJson(result ? {
                ...result,
                boundingBox: bbox(result.geojson)
            } : {}));
    }, []);

    const handleInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setGeoJson({});

        const file = event.target.files?.item(0);
        if (!file) {
            return;
        }
        const fileExtension = FileToGeoJSONParser.getFileExtension(file);
        const result = await parsers.get(fileExtension)?.parse(file);
        setGeoJson(result ?? { error: new Error('No parser found for file.') });
    };

    return (
        <GaugeContext.Provider value={{ ...gaugeControls, ...mapLayout }}>
            <div className={styles.layout} style={{ ...controlsCssStyle, ...mapLayoutCssStyle } as CSSProperties}>
                <div className={styles["side-panel"]}>
                    <div>
                        <input type="file" accept={[...parsers.keys()].join(', ')} onChange={handleInput} />
                        <FileInputStatus ok={!!geojson && !error} error={error} routeName={routeName} />
                    </div>
                    <hr className={styles.divider} />
                    <MapLayoutControls mapLayout={mapLayout} onMapLayoutChange={setMapLayout} />
                    <hr className={styles.divider} />
                    <GaugeControls gaugeControls={gaugeControls} onGaugeConrolsChange={setGaugeControls} />
                </div>
                <MapSection geojson={geojson} boundingBox={boundingBox} />
            </div>
        </GaugeContext.Provider>
    );
};
