import { BehaviorSubject } from "rxjs";
import maplibregl from "maplibre-gl";
import turfDistance from "@turf/distance";
import { point as turfPoint } from "@turf/helpers";
import { backgroundMapStyle, customRoadsMapStyle, MapStyle, osmMapStyle } from "./map-styles";
import { Overlay } from "./model";
import { FeatureProperties, GeoJson } from "../../parsers";

/**
 * Stores and manages the map.
 */
export class Cartomancer {
    public static styles = new Map<string, MapStyle>([
        ['background', backgroundMapStyle],
        ['osm', osmMapStyle],
        ['custom-roads', customRoadsMapStyle]
    ]);

    public map: maplibregl.Map;

    public isInitialised$ = new BehaviorSubject(false);
    public isStyleLoaded$ = new BehaviorSubject(false);
    private selectedStyleLocalStorageId = 'cartomancer:map-style';
    public selectedStyleId$: BehaviorSubject<string>;
    public zoom$ = new BehaviorSubject(0);

    public constructor() {
        let styleId = localStorage.getItem(this.selectedStyleLocalStorageId);
        if (!styleId || !Cartomancer.styles.get(styleId)) {
            styleId = 'osm';
        }
        this.selectedStyleId$ = new BehaviorSubject(styleId);

        const style = Cartomancer.styles.get(styleId) || osmMapStyle;
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

    public overlays$ = new BehaviorSubject<Overlay[]>([]);

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

    public addOverlay = (overlay: Overlay) => {
        if (this.overlays$.value.some((o) => o.id === overlay.id)) {
            throw new Error(`Overlay with id: ${overlay.id} already exists.`);
        }
        this.overlays$.next(this.overlays$.value.concat(overlay));
    };

    public removeOverlay = (id: string) => {
        this.overlays$.next(this.overlays$.value.filter((overlay) => overlay.id !== id));
    };

    /**
     * Adds sources and afterwards layers.
     */
    public addSourcesAndLayers = (
        sources: { [key in string]: maplibregl.SourceSpecification },
        layers: maplibregl.LayerSpecification[],
    ) => {
        for (const [sourceId, source] of Object.entries(sources)) {
            this.map.addSource(sourceId, source);
        }

        for (const layer of layers) {
            this.map.addLayer(layer);
        }
    };

    /**
     * Removes layers with given `layerIds` and afterwards sources with given `sourceIds`.
     */
    public clearLayersAndSources = (
        layerIds: string[],
        sourceIds: string[]
    ) => {
        for (const id of layerIds) {
            if (this.map.getLayer(id)) {
                this.map.removeLayer(id);
            }
        }
        for (const id of sourceIds) {
            if (this.map.getSource(id)) {
                this.map.removeSource(id);
            }
        }
    };

    /**
     * Searches for the closest point to a given coordinate using the turf distance metric (Haversine formula).
     * @param lngLat Coordinates for which to find the closest feature.
     * @param geojson Route data to get feature id from.
     * @returns A tuple where the first element is the ID of the closest feature from `geojson`, and second is the feature.
     */
    public static getClosestFeature = (
        geojson: GeoJson,
        lngLat?: maplibregl.LngLat,
    ): [number, GeoJSON.Feature<GeoJSON.Point, FeatureProperties>] => {
        if (!lngLat) {
            return [0, geojson.features[0]];
        }
        const [feature] = geojson.features.reduce<[GeoJSON.Feature<GeoJSON.Point, FeatureProperties>, number]>((acc, val) => {
            const from = turfPoint([lngLat.lng, lngLat.lat]);
            const to = turfPoint(val.geometry.coordinates);
            const distance = turfDistance(from, to, { units: 'meters' });

            return distance < acc[1] ? [val, distance] : acc;
        }, [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {
                id: -1,
                time: new Date().toISOString()
            }
        }, Infinity]);

        return [feature.properties.id, feature];
    };

    public updateFeatureState = (
        source: string,
        featureIds: Set<string | number>,
        property: string,
        value: boolean,
    ) => {
        for (const id of featureIds) {
            if (this.map.getSource(source)) {
                this.map.setFeatureState({ source, id: id }, { [property]: value });
            }
        }
    };
}
