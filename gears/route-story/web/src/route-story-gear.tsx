import { combineLatest, Subscription } from 'rxjs';
import * as maplibregl from "maplibre-gl";
import { RouteStoryGear } from '@the-dead-planet/nav-gauge-gears-route-story-common';
import { RouteLayer } from './layers/RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { Player } from './player/Player';
import { GeoJson, ParsingResultWithError } from '@tinker-chest';
import { Cartomancer, MarkerImage, GearApparatus, parsers } from '@apparatus';
import bbox from "@turf/bbox";
import { parseImage, WebMarkerImageData } from './images/image-parser';
import { AnimationControls } from './animation-controls/AnimationControls';
import { RouteName } from './file-input/RouteName';
import { AnimationControlsSearch } from './animation-controls/AnimationControlsSearch';
import { WebChronoLens } from '@web-apparatus';
import { RecChip } from './top-bar/RecChip';
import { LayerStylingPopup } from './layer-styling/LayerStylingPopup';

const SAMPLE_IMAGE_NAMES = [
   'IMG20260403173904.jpg',
   'IMG20260403171748.jpg',
   'IMG20260403163310.jpg',
   'IMG20260403151457.jpg',
   'IMG20260403151228.jpg',
   'IMG20260403145737.jpg',
   'IMG20260403141115.jpg',
];

export class WebRouteStoryGear extends RouteStoryGear<maplibregl.Map, WebChronoLens, File, WebMarkerImageData> {
   public routeUploadComponent = RouteName;
   public playerComponent = Player;
   public animatrixHeaderComponent = AnimationControlsSearch;
   public animatrixContentComponent = AnimationControls;
   public routeLayerComponent = RouteLayer;
   public imagesLayerComponent = ImagesLayer;
   public topBarChipComponent = RecChip;
   public layerStylingComponent = LayerStylingPopup;

   public constructor(apparatus: GearApparatus<maplibregl.Map, WebChronoLens>) {
      super(apparatus);

      fetch('/Lisboa walk.kml')
         .then((file) => file.text())
         .then((text) => parsers.get('.kml')?.parseTextToGeoJson(text))
         .then((result) => {
            if (!result) {
               return;
            }
            this.data$.next({ ...result, boundingBox: bbox(result.geojson) });
         })
         .catch(console.error)
         .then(() => this.loadSampleImages())
         .catch(console.error)
         .then(() => this.isEngaged$.next(true));
   }

   private loadSampleImages = async (): Promise<void> => {
      const files = await Promise.all(
         SAMPLE_IMAGE_NAMES.map(async (name) => {
            const blob = await fetch(`/${name}`).then((response) => response.blob());
            return new File([blob], name, { type: blob.type || 'image/jpeg' });
         }),
      );

      if (this.apparatus.cartomancer.map) {
         this.fileOperator.uploadFile(files, this.apparatus.cartomancer.map);
      }
   };

   public fitBounds = (map: maplibregl.Map, sw: [number, number], ne: [number, number]) => {
      const { topToolbarSizeRef, rightToolPanelSizeRef, leftToolPanelSizeRef, bottomToolPanelSizeRef, bottomSecondaryToolPanelSizeRef } = this.apparatus.toolsStation;
      const offset = 50;

      map.fitBounds([sw, ne], {
         animate: true, padding: {
            top: (topToolbarSizeRef.current?.clientHeight ?? 0) + offset,
            right: (rightToolPanelSizeRef.current?.clientWidth ?? 0) + offset,
            bottom: (bottomToolPanelSizeRef.current?.clientHeight ?? 0) + (bottomSecondaryToolPanelSizeRef.current?.clientHeight ?? 0) + offset,
            left: (leftToolPanelSizeRef.current?.clientWidth ?? 0) + offset,
         }
      });
   }

   public fileToText = async (file: File) => file.text();

   public readImage = async (file: File, geojson?: GeoJson) => {
      const reader = new FileReader();

      reader.onloadstart = () => {
         this.fileOperator.pushInitialImage(file.name);
      };

      reader.onprogress = (e) => {
         this.fileOperator.updateImageProgress(file.name, e.loaded / e.total * 100)
      };

      reader.onload = async (e) => {
         const { data, bitmap, thumbnailBitmap, lngLat, error } = await parseImage(e, file, { shape: 'circle' });

         const nextImages = this.images$.value.slice();
         const index = this.images$.value.findIndex((el) => el.name === file.name);
         const [featureId, feature] = geojson ? Cartomancer.getClosestFeature(geojson, lngLat) : [0, undefined];

         nextImages[index] = {
            ...nextImages[index],
            progress: 100,
            lngLat,
            data: { data, bitmap, thumbnailBitmap },
            error,
            featureId,
         };

         if (feature) {
            const markerElement = document.createElement('div');
            const featureLngLat = new maplibregl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);

            nextImages[index].data!.markerElement = markerElement;
            nextImages[index].data!.marker = new maplibregl.Marker({
               element: markerElement,
               draggable: true,
            }).setLngLat(featureLngLat);
         }

         this.images$.next(nextImages);
      };

      reader.onerror = (e) => {
         this.fileOperator.updateImageError(file.name, e.target?.error?.message);
      };

      reader.readAsDataURL(file);
   };

   public onCleanupStory = async (_data: ParsingResultWithError, _images: MarkerImage<WebMarkerImageData>[]): Promise<void> => { };

   private confirmBeforeLeaveSubscription: Subscription | null = null;

   public engageRouteStory = () => {
      this.confirmBeforeLeaveSubscription = this.subscribeConfirmBeforeLeave();
   };

   public disengageRouteStory = () => {
      this.confirmBeforeLeaveSubscription?.unsubscribe();
   };

   private confirmationHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      return "Route and image data will be lost.";
   };

   private subscribeConfirmBeforeLeave = (): Subscription => {
      return combineLatest([this.apparatus.individuator.settings$, this.data$, this.images$])
         .subscribe(([settings, { geojson }, images]) => {
            if (settings.confirmBeforeLeave && (geojson || images.length > 0)) {
               window.addEventListener("beforeunload", this.confirmationHandler);
            } else {
               window.removeEventListener('beforeunload', this.confirmationHandler);
            }
         });
   };
}
