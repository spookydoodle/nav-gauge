export type SignaliumNotice = ErrorSignaliumNotice | WarningSignaliumNotice | InfoSignaliumNotice;

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

export interface InfoSignaliumNotice extends BaseSignaliumNotice {
    type: 'info';
}
