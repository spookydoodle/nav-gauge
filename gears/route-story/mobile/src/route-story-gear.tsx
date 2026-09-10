import RNFS from 'react-native-fs';
import * as Exify from '@lodev09/react-native-exify';
import { RouteStoryGear } from '@the-dead-planet/nav-gauge-gears-route-story-common';
import { RouteLayer } from './layers/RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { Player } from './player/Player';
import { MobileChronoLens, MobileMap } from '@mobile-apparatus';
import { GeoJson, getExifError, getExifLngLat, ParsingResultWithError } from '@tinker-chest';
import { Cartomancer, MarkerImage, GearApparatus, parsers } from '@apparatus';
import bbox from "@turf/bbox";
import { cacheReducedImage, prependFilePrefix, MobileMarkerImageData, resetTempSubfolder } from './images/image-parser';
import { DocumentPickerResponse } from '@react-native-documents/picker';
import { RouteName } from './player/RouteName';
import { AnimationControlsSearch } from './animation-controls/AnimationControlsSearch';
import { AnimationControls } from './animation-controls/AnimationControls';
import { RecChip } from './top-bar/RecChip';
import { LayerStylingPopup } from './layer-styling/LayerStylingPopup';

const SAMPLE_ROUTE = {
   name: 'Lisboa walk.kml',
};

const SAMPLE_IMAGES = [
   'IMG20260403173904.jpg',
   'IMG20260403171748.jpg',
   'IMG20260403163310.jpg',
   'IMG20260403151457.jpg',
   'IMG20260403151228.jpg',
   'IMG20260403145737.jpg',
   'IMG20260403141115.jpg',
];

const toDocumentPickerResponse = (uri: string, name: string, type: string): DocumentPickerResponse => ({
   uri,
   name,
   error: null,
   type,
   nativeType: type,
   size: null,
   isVirtual: false,
   convertibleToMimeTypes: null,
   hasRequestedType: true,
});

export class MobileRouteStoryGear extends RouteStoryGear<MobileMap, MobileChronoLens, DocumentPickerResponse, MobileMarkerImageData> {
   public playerComponent = Player;
   public routeUploadComponent = RouteName;
   public animatrixHeaderComponent = AnimationControlsSearch;
   public animatrixContentComponent = AnimationControls;
   public routeLayerComponent = RouteLayer;
   public imagesLayerComponent = ImagesLayer;
   public topBarChipComponent = RecChip;
   public layerStylingComponent = LayerStylingPopup;

   public constructor(apparatus: GearApparatus<MobileMap, MobileChronoLens>) {
      super(apparatus);

      this.loadSampleRoute()
         .catch(console.error)
         .then(() => this.loadSampleImages())
         .catch(console.error)
         .then(() => this.isEngaged$.next(true));
   }

   private loadSampleRoute = async (): Promise<void> => {
      const text = await RNFS.readFileAssets(SAMPLE_ROUTE.name, 'utf8');
      const result = parsers.get('.kml')?.parseTextToGeoJson(text);
      if (!result) {
         return;
      }
      this.data$.next({ ...result, boundingBox: bbox(result.geojson) });
   };

   private loadSampleImages = async (): Promise<void> => {
      await resetTempSubfolder();
      const files = await Promise.all(
         SAMPLE_IMAGES.map(async (name) => {
            const destination = `${RNFS.TemporaryDirectoryPath}/images/${name}`;
            await RNFS.copyFileAssets(name, destination);
            return toDocumentPickerResponse(prependFilePrefix(destination), name, 'image/jpeg');
         }),
      );

      setTimeout(() => {
         if (this.apparatus.cartomancer.map) {
            this.fileOperator.uploadFile(files, this.apparatus.cartomancer.map);
         }
      }, 3000);
   };

   public engageRouteStory = () => {
      // Temp files are cleaned at the purge boundary (onCleanupStory) and at the start of each sample load;
      // resetting here would wipe the freshly-loaded sample files the moment the gear auto-engages.
   };

   public disengageRouteStory = () => {
      // resetTempSubfolder();
   };

   public fitBounds = async (map: MobileMap, sw: [number, number], ne: [number, number]) => {
      map.camera$.value?.fitBounds([...sw, ...ne], { padding: { bottom: 20, left: 20, right: 20, top: 20 } });
   }

   public fileToText = async (file: DocumentPickerResponse) => RNFS.readFile(file.uri, 'utf8');

   public readImage = async (file: DocumentPickerResponse, geojson?: GeoJson) => {
      const fileName = file.name;
      if (!fileName) {
         return;
      }
      this.fileOperator.pushInitialImage(fileName);

      try {
         const exif = await Exify.read(file.uri);
         const { fullSize, thumbnail } = await cacheReducedImage(file, (error) => {
            this.apparatus.signaliumBureau.addNotice({
               id: 'image-resize',
               type: 'error',
               error,
               text: 'Error processing images',
            });
         });

         const nextImages = this.images$.value.slice();
         const index = this.images$.value.findIndex((el) => el.name === file.name);
         const lngLat = exif ? getExifLngLat(exif) : undefined;
         const [featureId, _feature] = geojson ? Cartomancer.getClosestFeature(geojson, lngLat) : [0, undefined];

         nextImages[index] = {
            ...nextImages[index],
            progress: 100,
            lngLat,
            data: {
               uri: file.uri,
               fullSize: fullSize ? prependFilePrefix(fullSize) : undefined,
               thumbnail: thumbnail ? prependFilePrefix(thumbnail) : undefined,
            },
            error: getExifError(exif),
            featureId,
         };
         this.images$.next(nextImages);
      } catch (err) {
         this.fileOperator.updateImageError(file.name!, (err as Error)?.message);
      }
   }

   public onCleanupStory = async (
      _data: ParsingResultWithError,
      _images: MarkerImage<MobileMarkerImageData>[]
   ): Promise<void> => {
      resetTempSubfolder();
   };
}
