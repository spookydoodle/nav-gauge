import { BehaviorSubject } from "rxjs";
import maplibregl from "maplibre-gl";
import { MAP_STYLES, MapStyle } from "../map-styles";

/**
 * Stores and manages the map.
 */
export class Cartographer {
    public static styles = new Map<string, MapStyle>(MAP_STYLES);

    public map = new maplibregl.Map({
        container: document.createElement('div'),
        style: {
            version: 8,
            layers: [{
                type: 'background',
                id: 'background',
                paint: {
                    'background-color': 'transparent'
                }
            }],
            sources: {}
        },
        attributionControl: false,
        maxPitch: 80,
    });

    public isInitialised$ = new BehaviorSubject(false);
    public isStyleLoaded$ = new BehaviorSubject(false);
    public selectedStyleId$ = new BehaviorSubject('osm');
    public zoom$ = new BehaviorSubject(0);

    public constructor() { }

    /**
     * Safely updates style and sets the `isStyleLoaded` accordingly to allow layer components to unmount for the duration of the updates to avoid "Style is not done loading" errors.
     */
    public updateStyle = (style: string | maplibregl.StyleSpecification) => {
        this.isStyleLoaded$.next(false);
        this.map.setStyle(style);

        const isLoadedHandler = () => {
            if (this.map.isStyleLoaded()) {
                this.isStyleLoaded$.next(true);
                this.map.off('data', isLoadedHandler);
            }
        }

        this.map.on('data', isLoadedHandler);
    };
}