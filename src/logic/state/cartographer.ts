import { BehaviorSubject } from "rxjs";
import maplibregl from "maplibre-gl";
import { backgroundMapStyle, customRoadsMapStyle, MapStyle, osmMapStyle } from "../map-styles";

/**
 * Stores and manages the map.
 */
export class Cartographer {
    public static styles = new Map<string, MapStyle>([
        ['background', backgroundMapStyle],
        ['osm', osmMapStyle],
        ['custom-roads', customRoadsMapStyle]
    ]);

    public map: maplibregl.Map;

    public isInitialised$ = new BehaviorSubject(false);
    public isStyleLoaded$ = new BehaviorSubject(false);
    private selectedStyleLocalStorageId = 'cartographer:map-style';
    public selectedStyleId$: BehaviorSubject<string>;
    private styleAbortController = new AbortController();
    public zoom$ = new BehaviorSubject(0);

    public constructor() {
        let styleId = localStorage.getItem(this.selectedStyleLocalStorageId);
        if (!styleId || !Cartographer.styles.get(styleId)) {
            styleId = 'osm';
        }
        this.selectedStyleId$ = new BehaviorSubject(styleId);

        const style = Cartographer.styles.get(styleId) || osmMapStyle;
        this.map = new maplibregl.Map({
            container: document.createElement('div'),
            style: style.style,
            attributionControl: false,
            maxPitch: 80,
        });

        this.selectedStyleId$.subscribe((id) => {
            const nextStyle = Cartographer.styles.get(id);
            if (!nextStyle) {
                return;
            }
            this.updateStyle(nextStyle.style);

            localStorage.setItem(this.selectedStyleLocalStorageId, id);
        });
    }

    /**
     * Safely updates style and sets the `isStyleLoaded` accordingly to allow layer components to unmount for the duration of the updates to avoid "Style is not done loading" errors.
     */
    private updateStyle = (style: string | maplibregl.StyleSpecification) => {
        this.isStyleLoaded$.next(false);
        this.map.setStyle(style);
        this.validateStyleLoaded();
    };

    /**
     * Safely updates style and sets the `isStyleLoaded` accordingly to allow layer components to unmount for the duration of the updates to avoid "Style is not done loading" errors.
     */
    private validateStyleLoaded = () => {
        this.styleAbortController.abort();
        this.styleAbortController = new AbortController();

        const isLoadedHandler = (_event: maplibregl.MapDataEvent) => {
            if (this.styleAbortController.signal.aborted) {
                this.map.off('data', isLoadedHandler);
            } else
                if (this.map.isStyleLoaded()) {
                    setTimeout(() => {
                        this.isStyleLoaded$.next(true);
                        this.map.off('data', isLoadedHandler);
                    }, 100); // TODO: Fix race condition with cleanup of layers
                }
        }

        this.map.on('data', isLoadedHandler);
    };
}