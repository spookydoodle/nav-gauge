import { BehaviorSubject, pairwise } from "rxjs";
import { SignaliumBureau } from "../signalium-bureau";
import { SurveillanceState } from "./model";
import { formatTimestamp } from "../../../tinker-chest";

/**
 * Records the videos.
 */
export class ChronoLens {
    private signaliumBureau: SignaliumBureau
    private recorder: MediaRecorder | undefined;
    private stream: MediaStream | undefined;
    private chunks: Blob[] = [];
    private noticeId = 'chrono-lens-state';

    public surveillanceState$ = new BehaviorSubject<SurveillanceState>(SurveillanceState.Stopped);
    public isPlaying$ = new BehaviorSubject(false);

    public constructor(signaliumBureau: SignaliumBureau) {
        this.signaliumBureau = signaliumBureau;

        this.surveillanceState$.pipe(pairwise()).subscribe(([prev, next]) => {
            switch (next) {
                case SurveillanceState.Stopped:
                    this.stopRecording();
                    break;
                case SurveillanceState.Paused:
                    this.pauseRecording();
                    break;
                case SurveillanceState.InProgress: {
                    if (prev === SurveillanceState.Paused) {
                        this.resumeRecording();
                    } else {
                        this.startRecording(
                            undefined, // TODO: Let user decide
                            (error) => {
                                this.signaliumBureau.addNotice({
                                    id: this.noticeId,
                                    type: 'error',
                                    error: error.error as Error,
                                    text: 'Something went wrong during recording.'
                                })
                            }
                        );
                    }
                    break;
                }
            }
        });
    }

    private startRecording = async (
        downloadFileName?: string,
        onError?: (e: ErrorEvent) => void,
    ) => {
        if (!this.recorder) {
            await this.setup(downloadFileName, onError);
        }
        this.recorder?.start();
        this.isPlaying$.next(true);
        this.signaliumBureau.addNotice({
            id: this.noticeId,
            type: 'info',
            text: 'Recording started'
        }, { keepAlive: true });
    };

    private pauseRecording = () => {
        this.recorder?.pause();
        this.isPlaying$.next(false);
    };

    private resumeRecording = () => {
        this.recorder?.resume();
        this.isPlaying$.next(true);
    };

    private stopRecording = () => {
        this.recorder?.stop();
    };

    private stopCleanup = () => {
        this.isPlaying$.next(false);
        this.surveillanceState$.next(SurveillanceState.Stopped);
        this.signaliumBureau.addNotice({
            id: this.noticeId,
            type: 'info',
            text: 'Recording stopped'
        });
    };

    private setup = async (
        downloadFileName?: string,
        onError?: (e: ErrorEvent) => void,
    ) => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: 30
                },
                audio: false
            })
            this.stream = stream;
            this.recorder = this.setupRecording(stream, downloadFileName, onError);
        } catch (err) {
            this.signaliumBureau.addNotice({
                id: this.noticeId,
                type: 'error',
                error: err as Error,
                text: 'Something went wrong.'
            })
        }
    }

    private setupRecording = (
        stream: MediaStream,
        downloadFileName?: string,
        onError?: (e: ErrorEvent) => void,
    ): MediaRecorder => {
        const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9",
        });

        recorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
        }

        recorder.onpause = () => { }

        recorder.onstop = (e) => {
            const blob = new Blob(this.chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            this.download(url, downloadFileName);
            this.chunks = [];
            this.stopCleanup();
        };

        recorder.onerror = (e) => {
            onError?.(e);
            this.stopRecording();
            this.cleanup();
        };

        return recorder;
    };

    private download = (
        url: string,
        fileName = `Voyage Log ${formatTimestamp(new Date().valueOf(), 0)}`.replaceAll(".", "").replaceAll("_", "").replaceAll(" ", "")
    ) => {
        const a = document.createElement("a");
        a.id = "download-action"
        a.href = url;
        a.download = `${fileName}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    /**
     * Resets the recorder and stream completely.
     */
    public cleanup = () => {
        this.recorder?.stop();
        for (const track of this.stream?.getTracks() ?? []) {
            track.stop();
        }
        this.recorder = undefined;
        this.stream = undefined;
        this.chunks = [];
    };
}