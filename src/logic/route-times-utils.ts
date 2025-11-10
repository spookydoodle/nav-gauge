import { DateTime } from "luxon";
import { TimeFormat } from "./preferences/model";
import { defaultDateFormat, defaultTimeFormat } from "./preferences/preferences";

/**
 * Formats milliseconds as HH:mm:ss.
 * @param progressMs Time in ms since epoch.
 * @example 13583000 will be formatted as `03:46:23`
 */
export const formatProgressMs = (progressMs: number): string => {
    return DateTime.fromMillis(progressMs, { zone: 'UTC' }).toFormat("HH:mm:ss");
};

/**
 * 
 * @param progressMs 
 * @param startTime 
 * @returns 
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
