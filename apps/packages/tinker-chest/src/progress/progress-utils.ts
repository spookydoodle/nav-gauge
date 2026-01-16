import { DateTime } from "luxon";
import { RouteTimes } from "./model";
import { TimeFormat } from "../preferences/model";
import { defaultDateFormat, defaultTimeFormat } from "../preferences/preferences";

/**
 * Formats milliseconds as HH:mm:ss.
 * @param progressMs Time in ms since epoch.
 * @example 13583000 will be formatted as `03:46:23`
 */
export const formatProgressMs = (progressMs: number): string => {
    return DateTime.fromMillis(progressMs, { zone: 'UTC' }).toFormat("HH:mm:ss");
};

/**
 * Formats progress in milliseconds to user friendly format.
 * @param progressMs Value in milliseconds.
 * @param startTimeEpoch Route start time as milliseconds since epoch.
 * @param options Options to overwrite default timezone and datetime formats.
 * @returns Formatted value, for example `Thu 31.07.2025 10:00:00`
 */
export const formatTimestamp = (progressMs: number, startTimeEpoch?: number, options?: {
    zone?: string;
    dateFormat?: '';
    timeFormat?: TimeFormat
}): string => {
    if (startTimeEpoch === undefined) {
        return '';
    }
    const {
        zone,
        dateFormat = defaultDateFormat,
        timeFormat = defaultTimeFormat
    } = options ?? {};
    return DateTime.fromMillis(startTimeEpoch + progressMs, { zone }).toFormat(`${dateFormat} ${timeFormat}`);
};

/**
 * Current progress as percentage of total duration.
 * @returns Value between 0 and 100.
 */
export const getProgressPercentage = (progressMs: number, routeTimes?: RouteTimes): number => {
    if (!routeTimes) {
        return 0;
    }
    return (progressMs / routeTimes.duration * 100);
};
