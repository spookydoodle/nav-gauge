import { BehaviorSubject } from "rxjs";
import { SignaliumNotice } from "./model";

/**
 * Manages notices displayed to user.
 * Errors remain until the problem is solved or upon user interaction.
 * The other types will be cleared after 10s or upon user interaction, unless specified differently in notice definition.
 */
export class SignaliumBureau {
    /**
     * Time after which the notice should be automatically removed.
     */
    private defaultExpirationTime = 10000;
    public notices$ = new BehaviorSubject<(SignaliumNotice & { expirationTimeout?: NodeJS.Timeout })[]>([]);

    public constructor() { }

    /**
     * If `notice.id` is not unique, will replace existing one.
     * Errors remain until the problem is solved or upon user interaction.
     * The other types will be cleared after 10s or upon user interaction, unless specified differently in notice options.
     * @param notice 
     * @param options.keepAlive If set to `true`, will not clear the non-error notice automatically after the expiration time.
     * @param options.expirationTime Defaults to 10s.
     */
    public addNotice = (notice: SignaliumNotice, options: {
        keepAlive?: boolean;
        expirationTime?: number;
    } = {}) => {
        const {
            keepAlive = false,
            expirationTime = this.defaultExpirationTime
        } = options;
        let expirationTimeout: NodeJS.Timeout | undefined;

        if (notice.type !== 'error' && !keepAlive) {
            expirationTimeout = setTimeout(() => this.removeNotice(notice.id), expirationTime);
        }

        const nextNotices = this.notices$.value.filter((n) => n.id !== notice.id).concat([{ ...notice, expirationTimeout }]);
        this.notices$.next(nextNotices);
    }

    public removeNotice = (noticeId: string) => {
        const expirationTimeout = this.notices$.value.find((notice) => notice.id === noticeId)?.expirationTimeout;
        if (expirationTimeout) {
            clearTimeout(expirationTimeout);
        }
        this.notices$.next(this.notices$.value.filter((n) => n.id !== noticeId));
    }
}
