import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import { defaultMapLayout, MapLayout, MapLayoutControls } from "./MapLayoutControls";
import { defaultGaugeControls, GaugeControls } from "./GaugeControls";
import { Map } from "./Map";
import { RouteLayer } from "./RouteLayer";
import { GpxParser } from "../gpx/gpx-parser";
import './nav-gauge.css';

// TODO: Add saving in local storage
const parser = new GpxParser();

export const NavGauge: FC = () => {
    const [geojson, setGeoJson] = useState<[GeoJSON.FeatureCollection, string | undefined]>();
    const [gaugeControls, setGaugeControls] = useState<GaugeControls>(defaultGaugeControls);
    const [mapLayout, setMapLayout] = useState<MapLayout>(defaultMapLayout);

    const { controlPosition, controlPlacement, showZoom, showCompass, showGreenScreen } = gaugeControls;

    const controlsCssStyle = useMemo(
        () => {
            switch (controlPosition) {
                case 'top-left': return { '--ctrl-top': controlPlacement.top + 'px', '--ctrl-left': controlPlacement.left + 'px' }
                case 'top-right': return { '--ctrl-top': controlPlacement.top + 'px', '--ctrl-right': controlPlacement.right + 'px' }
                case 'bottom-left': return { '--ctrl-bottom': controlPlacement.bottom + 'px', '--ctrl-left': controlPlacement.left + 'px' }
                case 'bottom-right': return { '--ctrl-bottom': controlPlacement.bottom + 'px', '--ctrl-right': controlPlacement.right + 'px' }
            }
        },
        [controlPosition, controlPlacement]
    );

    const mapLayoutCssStyle = useMemo(
        () => {
            return {
                '--map-width': mapLayout.width + 'px',
                '--map-height': mapLayout.height + 'px',
                '--map-border-width': mapLayout.borderWidth + 'px',
                '--map-border-color': mapLayout.borderColor,
                '--map-inner-border-width': mapLayout.innerBorderWidth + 'px',
                '--map-inner-border-color': mapLayout.innerBorderColor,
                '--map-radius': mapLayout.borderRadius,
                '--map-box-shadow': mapLayout.boxShadow,
                '--map-inner-box-shadow': mapLayout.innerBoxShadow,
            }
        },
        [mapLayout]
    );

    useEffect(() => {
        fetch('/example.gpx')
            .then((file) => file.text())
            .then((text) => parser.parseTextToGeoJson(text))
            .then((result) => setGeoJson(result));
    }, []);

    const handleInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (!file) {
            return;
        }
        setGeoJson(await parser.parseGpxFile(file))
    };

    return (
        <div className="layout" style={{ ...controlsCssStyle, ...mapLayoutCssStyle } as CSSProperties}>
            <div className="side-panel">
                <div>
                    <input type="file" onChange={handleInput} />
                </div>
                <MapLayoutControls mapLayout={mapLayout} onMapLayoutChange={setMapLayout} />
                <hr className="divider" />
                <GaugeControls gaugeControls={gaugeControls} onGaugeConrolsChange={setGaugeControls} />
            </div>
            <Map
                showZoom={showZoom}
                showCompass={showCompass}
                controlPosition={controlPosition}
                showGreenScreen={showGreenScreen}
            >
                {geojson ? <RouteLayer geojson={geojson[0]} name={geojson[1]} /> : null}
            </Map>
        </div>
    );
};
