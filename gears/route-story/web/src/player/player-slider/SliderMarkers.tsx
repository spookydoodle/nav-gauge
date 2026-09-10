import type * as maplibregl from "maplibre-gl";
import { FC, useEffect, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import classNames from "classnames";
import bbox from "@turf/bbox";
import { MarkerImage, useMultipleTranslations } from "@apparatus";
import { ParsingResultWithError, useSubjectState } from "@tinker-chest";
import {
    draggingImage$,
    draggingClosestFeature$,
    highlightIdsBySourceId$,
    imageSourceIds,
    RouteStoryTranslationKey,
    RouteTimes,
    Animatrix,
    updateImageFeatureId,
    getPosition,
    getClosestFeatureFromPosition
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../../images/image-parser";
import { Button } from "@web-ui";
import { Icons } from "@ui";
import styles from './slider-markers.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: maplibregl.Map,
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<WebMarkerImageData>[]>;
    fitBoundsHandler: (map: maplibregl.Map, boundingBox?: GeoJSON.BBox) => void;
    animatrix: Animatrix;
}

export const SliderMarkers: FC<Props> = ({
    gearId,
    translationKey,
    map,
    data$,
    routeTimes$,
    images$,
    fitBoundsHandler,
    animatrix,
}) => {
    const [{ geojson }] = useSubjectState(data$);
    const [routeTimes] = useSubjectState(routeTimes$);
    const [images] = useSubjectState(images$);
    const [animationControls] = useSubjectState(animatrix.controls$);
    const [highlightIdsBySourceId, setHighlightIdsBySourceId] = useSubjectState(highlightIdsBySourceId$);
    const [draggingImage, setDraggingImage] = useSubjectState(draggingImage$);
    const [draggingClosestFeature] = useSubjectState(draggingClosestFeature$);
    const [
        imageLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.Image },
    ]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (draggingImage === null || draggingImage.interaction !== 'player') {
            return;
        }

        const handleMove = (clientX: number) => {
            const container = containerRef.current;
            if (!container) {
                return;
            }
            const rect = container.getBoundingClientRect();
            const positionPercent = ((clientX - rect.left) / rect.width) * 100;
            const closestFeature = getClosestFeatureFromPosition(positionPercent, geojson, routeTimes);
            if (closestFeature !== null) {
                draggingClosestFeature$.next(closestFeature);
            }
        };

        const handleEnd = () => {
            const closestFeature = draggingClosestFeature$.value;
            if (draggingImage$.value !== null && closestFeature !== null) {
                updateImageFeatureId(images$, draggingImage$.value.id, closestFeature.properties.id);
            }
            draggingClosestFeature$.next(null);
            setDraggingImage(null);
        };

        const pointerMoveHandler = (e: PointerEvent) => handleMove(e.clientX);
        const pointerUpHandler = () => handleEnd();

        window.addEventListener('pointermove', pointerMoveHandler);
        window.addEventListener('pointerup', pointerUpHandler);
        window.addEventListener('pointercancel', pointerUpHandler);

        return () => {
            window.removeEventListener('pointermove', pointerMoveHandler);
            window.removeEventListener('pointerup', pointerUpHandler);
            window.removeEventListener('pointercancel', pointerUpHandler);
        };
    }, [draggingImage, images$, getClosestFeatureFromPosition]);

    const draggingFeaturePosition = draggingClosestFeature !== null
        ? getPosition(draggingClosestFeature.properties.id, geojson, routeTimes)
        : null;

    return (
        <div ref={containerRef} className={styles['slider-markers']}>
            {images
                .filter((image) => image.featureId !== undefined)
                .map((image) => (
                    <div
                        key={image.id}
                        className={styles['image-marker-container']}
                        style={{
                            left: `${getPosition(image.featureId, geojson, routeTimes).toFixed(0)}%`
                        }}
                    >
                        <span
                            role="button"
                            tabIndex={0}
                            draggable={false}
                            aria-label={`${imageLabel} ${image.id}`}
                            title={`${imageLabel} ${image.id}`}
                            onMouseEnter={() => {
                                setHighlightIdsBySourceId(new Map([[imageSourceIds.thumbnails, new Set([image.id.toString()])]]));
                            }}
                            onMouseLeave={() => {
                                setHighlightIdsBySourceId(new Map());
                            }}
                            onPointerDown={(e) => {
                                e.preventDefault();
                                setDraggingImage({ id: image.id, interaction: 'player' });
                            }}
                            className={classNames(styles['image-marker'], {
                                [styles['dragging']]: draggingImage?.id === image.id,
                                [styles['highlight']]: draggingImage?.id !== image.id && highlightIdsBySourceId.get(imageSourceIds.thumbnails)?.has(image.id.toString())
                            })}
                        />
                        <Button
                            icon={Icons.NounProject.Target}
                            size="xs"
                            onClick={(event) => {
                                event.stopPropagation();
                                const feature = geojson?.features.find((f) => f.id === image.featureId);
                                if (feature) {
                                    fitBoundsHandler(map, bbox(feature));
                                }
                            }}
                            className={styles['pan-to-icon']}
                        />
                    </div>
                ))}
            {animationControls.panToWholeRouteAtEnd && (
                <div className={styles['route-end-marker-container']}>
                    <span role="presentation" className={styles['route-end-marker']} />
                    <Button
                        icon={Icons.NounProject.Target}
                        size="xs"
                        aria-label="Fit route bounds"
                        onClick={(event) => {
                            event.stopPropagation();
                            fitBoundsHandler(map, data$.value.boundingBox);
                        }}
                        className={styles['pan-to-icon']}
                    />
                </div>
            )}
            {draggingFeaturePosition !== null && (
                <span
                    className={classNames(styles['image-marker'], styles['drag-marker'], styles['highlight'])}
                    style={{
                        left: `${draggingFeaturePosition.toFixed(4)}%`
                    }}
                />
            )}
        </div>
    );
};
