export type SignaliumNotice = ErrorSignaliumNotice;

export interface BaseSignaliumNotice {
    id: string;
    text: string;
}

export interface ErrorSignaliumNotice extends BaseSignaliumNotice {
    type: 'error';
    error: Error;
}

export interface WarningSignaliumNotice extends BaseSignaliumNotice {
    type: 'warning';
}
