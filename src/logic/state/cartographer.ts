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
            localStorage.setItem(this.selectedStyleLocalStorageId, id);
        });
    }

    /**
     * Safely updates style and resolves when the `map.isStyleLoaded()` check resolves.
     */
    public updateStyle = async (
        style: string | maplibregl.StyleSpecification,
        abortSignal: AbortSignal,
        onError?: (err: unknown) => void
    ) => {
        try {
            this.isStyleLoaded$.next(false);
            this.map.setStyle(style);
            await this.validateStyleLoaded(abortSignal);
            this.isStyleLoaded$.next(true);
        } catch (err) {
            onError?.(err);
        }
    };

    /**
     * Subscribes to map `idle` events and resolves when `map.isStyleLoaded()` resolves.
     */
    private validateStyleLoaded = (
        abortSignal: AbortSignal
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            const isLoadedHandler = (_event: maplibregl.MapDataEvent) => {
                if (abortSignal.aborted) {
                    this.map.off('idle', isLoadedHandler);
                    reject("User aborted map style validation.")
                } else
                    if (this.map.isStyleLoaded()) {
                        this.map.off('idle', isLoadedHandler);
                        resolve();
                    }
            }

            this.map.on('idle', isLoadedHandler);
        });
    };
}