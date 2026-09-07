import { formatTimeMsAsStandard } from "@ui";
import { RouteTimes } from "../model";

/**
 * Current progress as percentage of total duration.
 * @returns Value between 0 and 100.
 */
export const getProgressPercentage = (progressMs: number, routeTimes?: RouteTimes | null): number => {
    if (!routeTimes) {
        return 0;
    }
    return (progressMs / routeTimes.duration * 100);
};

export const formatCurrentTimestamp = (progressMs: number, progressPercentage: number): string => {
    return `${formatTimeMsAsStandard(progressMs)} (${progressPercentage.toFixed(0)}%)`;
};
