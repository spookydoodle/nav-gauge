import { CSSProperties, Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import bbox from "@turf/bbox";
import { Presets } from "./controls/Presets";
import { AnimationControls } from "./controls/AnimationControls";
import { MapLayoutControls } from "./controls/MapLayoutControls";
import { ApplicationSettings } from "./controls/ApplicationSettings";
import { GaugeControls } from "./controls/GaugeControls";
import { ApplicationSettingsType, defaultGaugeControls, defaultMapLayout, GaugeControlsType, MapLayout } from "../tinker-chest";
import { MapSection } from "./MapSection";
import { GaugeContext, useStateWarden } from "../contexts";
import { useImageReader, useLocalStorageState } from "../hooks";
import { RouteTimes } from "../tinker-chest";
import { parsers, ParsingResultWithError, Preset, PresetStation, PresetValues } from "../apparatus";
import { FileInput } from "./controls/FileInput";
import { MapStyleSelection } from "./controls/MapStyleSelection";
import * as styles from './machine.module.css';

interface Props {
    applicationSettings: ApplicationSettingsType;
    onApplicationSettingsChange: Dispatch<SetStateAction<ApplicationSettingsType>>;
}

export const Machine: FC<Props> = ({
    applicationSettings,
    onApplicationSettingsChange
}) => {
    const stateWarden = useStateWarden();
    const { animatrix } = stateWarden;
    const [{ geojson, boundingBox, routeName, error }, setGeoJson] = useState<ParsingResultWithError>({});

    useEffect(() => {
        stateWarden.engine.openValves(stateWarden);

        return () => {
            stateWarden.engine.closeValves(stateWarden);
        };
    }, [stateWarden]);

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

    const [images, readImage, updateImageFeatureId] = useImageReader();
    const [gaugeControls, setGaugeControls] = useLocalStorageState<GaugeControlsType>('gauge-controls', defaultGaugeControls);
    const [mapLayout, setMapLayout] = useLocalStorageState<MapLayout>('map-layout', defaultMapLayout);
    const [preset, setPreset] = useState<Preset>(PresetStation.detectPreset(mapLayout, gaugeControls));

    useEffect(() => {
        if (!applicationSettings.confirmBeforeLeave || (!geojson && images.length === 0)) {
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
    }, [applicationSettings.confirmBeforeLeave, images, geojson]);

    const handlePresetChange = (preset: Preset, {
        presetMapLayout,
        presetGaugeControls,
        presetAnimationControls,
    }: PresetValues = {}) => {
        setPreset(preset);
        if (presetMapLayout) {
            setMapLayout(presetMapLayout);
        }
        if (presetGaugeControls) {
            setGaugeControls(presetGaugeControls);
        }
        if (presetAnimationControls) {
            animatrix.controls$.next(presetAnimationControls);
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

    useEffect(() => {
        fetch('/example.gpx')
            .then((file) => file.text())
            .then((text) => parsers.get('.gpx')?.parseTextToGeoJson(text))
            .then((result) => setGeoJson(result ? {
                ...result,
                boundingBox: bbox(result.geojson)
            } : {}));
    }, []);

    return (
        <GaugeContext.Provider value={{ ...gaugeControls, ...mapLayout, ...applicationSettings }}>
            <div className={styles.layout} style={{
                ...controlsCssStyle,
                '--map-width': mapLayout.size.type === 'full-screen' ? '100%' : `${mapLayout.size.width}px`,
                '--map-height': mapLayout.size.type === 'full-screen' ? '100%' : `${mapLayout.size.height}px`,
                '--map-border-width': mapLayout.borderWidth + 'px',
                '--map-border-color': mapLayout.borderColor,
                '--map-inner-border-width': mapLayout.innerBorderWidth + 'px',
                '--map-inner-border-color': mapLayout.innerBorderColor,
                '--map-radius': mapLayout.borderRadius,
                '--map-box-shadow': mapLayout.boxShadow,
                '--map-inner-box-shadow': mapLayout.innerBoxShadow,
                // TODO: Make draggable on mobile
                '--side-panel-height-sm': "240px",
            } as unknown as CSSProperties}>
                <div className={styles["side-panel"]}>
                    <FileInput
                        routeName={routeName}
                        error={error}
                        geojson={geojson}
                        onGeojsonChange={setGeoJson}
                        readImage={readImage}
                    />
                    <hr className={styles.divider} />
                    <Presets preset={preset} onPresetChange={handlePresetChange} mapLayout={mapLayout} gaugeControls={gaugeControls} />
                    <MapStyleSelection />
                    <MapLayoutControls mapLayout={mapLayout} onMapLayoutChange={setMapLayout} />
                    <GaugeControls gaugeControls={gaugeControls} onGaugeConrolsChange={setGaugeControls} />
                    <AnimationControls />
                    <ApplicationSettings applicationSettings={applicationSettings} onApplicationSettingsChange={onApplicationSettingsChange} />
                </div>
                <div className={styles["main-area"]}>
                    <MapSection
                        geojson={geojson}
                        boundingBox={boundingBox}
                        images={images}
                        onUpdateImageFeatureId={updateImageFeatureId}
                        routeTimes={routeTimes}
                    />
                </div>
            </div>
        </GaugeContext.Provider>
    );
};
