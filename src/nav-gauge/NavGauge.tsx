import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import bbox from "@turf/bbox";
import { FileInputStatus } from "../components";
import { detectPreset, Preset, Presets } from "./controls/Presets";
import { defaultMapLayout, MapLayout, MapLayoutControls } from "./controls/MapLayoutControls";
import { defaultGaugeControls, GaugeControls } from "./controls/GaugeControls";
import { MapSection } from "./MapSection";
import { GaugeContext } from "../contexts/GaugeContext";
import { useImageReader } from "../hooks/useImageReader";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { parsers, RouteTimes, FileToGeoJSONParser, ParsingResultWithError } from "../logic";
import * as styles from './nav-gauge.module.css';

export const NavGauge: FC = () => {
    const [{ geojson, boundingBox, routeName, error }, setGeoJson] = useState<ParsingResultWithError>({});

    const routeTimes = useMemo(
        (): RouteTimes | undefined => {
            if (!geojson?.features[0]) {
                return;
            }
            const startTime = geojson.features[0].properties.time;
            const endTime = geojson.features.slice(-1)[0]?.properties.time;
            const startTimeEpoch = new Date(startTime).valueOf();
            const endTimeEpoch = new Date(endTime).valueOf();

            return {
                startTime,
                endTime,
                startTimeEpoch,
                endTimeEpoch,
                duration: endTimeEpoch - startTimeEpoch
            }
        },
        [geojson]
    );

    const [images, readImage, updateImageFeatureId] = useImageReader(geojson);
    const [gaugeControls, setGaugeControls] = useLocalStorageState<GaugeControls>('gauge-controls', defaultGaugeControls);
    const [mapLayout, setMapLayout] = useLocalStorageState<MapLayout>('map-layout', defaultMapLayout);
    const [preset, setPreset] = useState<Preset>(detectPreset(mapLayout, gaugeControls));
    // TODO: Change to progress percentage of time duration and derive ms for current geojson
    const [progressMs, setProgressMs] = useState(0);

    useEffect(() => {
        if (!gaugeControls.confirmBeforeLeave || (!geojson && images.length === 0)) {
            return;
        }
        const confirmationHandler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            return "Route and image data will be lost.";
        };
        window.addEventListener("beforeunload", confirmationHandler);

        return () => {
            window.removeEventListener('beforeunload', confirmationHandler);
        }
    }, [gaugeControls.confirmBeforeLeave, images, geojson]);

    const handlePresetChange = (preset: Preset, presetMapLayout?: MapLayout, presetGaugeControls?: GaugeControls) => {
        setPreset(preset);
        if (presetMapLayout) {
            setMapLayout(presetMapLayout);
        }
        if (presetGaugeControls) {
            setGaugeControls(presetGaugeControls);
        }
    };

    const controlsCssStyle = useMemo(
        () => {
            const { top, bottom, right, left } = gaugeControls.controlPlacement;

            switch (gaugeControls.controlPosition) {
                case 'top-left': return { '--ctrl-top': top + 'px', '--ctrl-left': left + 'px' }
                case 'top-right': return { '--ctrl-top': top + 'px', '--ctrl-right': right + 'px' }
                case 'bottom-left': return { '--ctrl-bottom': bottom + 'px', '--ctrl-left': left + 'px' }
                case 'bottom-right': return { '--ctrl-bottom': bottom + 'px', '--ctrl-right': right + 'px' }
            }
        },
        [gaugeControls]
    );

    const mapLayoutCssStyle = useMemo(
        () => ({
            '--map-width': mapLayout.size.type === 'full-screen' ? '100%' : `${mapLayout.size.width}px`,
            '--map-height': mapLayout.size.type === 'full-screen' ? '100%' : `${mapLayout.size.height}px`,
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
        const { files } = event.target;
        if (!files || files.length === 0) {
            return;
        }
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)!;
            if (file.type.includes('image')) {
                readImage(file);
                continue;
            }
            setGeoJson({});
            setProgressMs(0);
            parsers
                .get(FileToGeoJSONParser.getFileExtension(file))
                ?.parse(file)
                .then((result => setGeoJson(result ?? { error: new Error('No parser found for file.') })));

        }
    };

    return (
        <GaugeContext.Provider value={{ ...gaugeControls, ...mapLayout }}>
            <div className={styles.layout} style={{
                ...controlsCssStyle,
                ...mapLayoutCssStyle,
                '--side-panel-height-sm': "240px",
            } as unknown as CSSProperties}>
                <div className={styles["side-panel"]}>
                    <div>
                        <input id="files" type="file" multiple accept={[...parsers.keys(), "image/png", "image/jpeg", "image/jpg"].join(', ')} onChange={handleInput} />
                        <FileInputStatus ok={!!geojson && !error} error={error} routeName={routeName} />
                    </div>
                    <hr className={styles.divider} />
                    <Presets preset={preset} onPresetChange={handlePresetChange} mapLayout={mapLayout} gaugeControls={gaugeControls} />
                    <hr className={styles.divider} />
                    <MapLayoutControls mapLayout={mapLayout} onMapLayoutChange={setMapLayout} />
                    <hr className={styles.divider} />
                    <GaugeControls gaugeControls={gaugeControls} onGaugeConrolsChange={setGaugeControls} />
                </div>
                <div className={styles["main-area"]}>
                    <MapSection
                        geojson={geojson}
                        boundingBox={boundingBox}
                        images={images}
                        updateImageFeatureId={updateImageFeatureId}
                        routeTimes={routeTimes}
                        progressMs={progressMs}
                        onProgressMsChange={setProgressMs}
                    />
                </div>
            </div>
        </GaugeContext.Provider>
    );
};
