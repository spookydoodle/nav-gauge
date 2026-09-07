import { BehaviorSubject } from "rxjs";
import { MarkerImage } from "@apparatus";

export function updateImageFeatureId<TImageData>(
    images$: BehaviorSubject<MarkerImage<TImageData>[]>,
    imageId: number,
    featureId: number
) {
    images$.next(images$.value.map((im) => im.id === imageId ? { ...im, featureId } : im))
}
