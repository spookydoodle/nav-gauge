import { BehaviorSubject } from "rxjs";
import { FrameRate, SurveillanceState } from "./model";

/**
 * Records the videos.
 */
export class ChronoLens {
    private recorder: MediaRecorder | undefined;
    private stream: MediaStream | undefined;
    private chunks: Blob[] = [];

    public frameRate$ = new BehaviorSubject<FrameRate>(30);
    public surveillanceState$ = new BehaviorSubject<SurveillanceState>(SurveillanceState.Stopped);
    public isPlaying$ = new BehaviorSubject(false);
    public donwloadName$ = new BehaviorSubject('Voyage Log');

    public constructor() {}

    public startRecording = async (
        onError?: (stage: string, error: Error) => void
    ) => {
        if (!this.recorder) {
            await this.setup(onError);
        }
        this.recorder?.start();
        this.isPlaying$.next(true);
    };

    public pauseRecording = () => {
        this.recorder?.pause();
        this.isPlaying$.next(false);
    };

    public resumeRecording = () => {
        this.recorder?.resume();
        this.isPlaying$.next(true);
    };

    public stopRecording = () => {
        this.recorder?.stop();
    };

    private stop = () => {
        this.isPlaying$.next(false);
        this.surveillanceState$.next(SurveillanceState.Stopped);
    };

    private setup = async (
        onError?: (stage: string, error: Error) => void
    ) => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: this.frameRate$.value
                },
                audio: false
            })
            this.stream = stream;
            this.recorder = this.setupRecording(stream, onError);
        } catch (error) {
            this.stream = undefined;
            this.recorder = undefined;
            onError?.("setup", error as Error);
        }
    }

    private setupRecording(
        stream: MediaStream,
        onError?: (stage: string, error: Error) => void
    ): MediaRecorder {
        const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9",
        });

        recorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
        }

        recorder.onpause = () => { }

        recorder.onstop = () => {
            this.download();
            this.chunks = [];
            this.stop();
        };

        recorder.onerror = (e) => {
            this.stopRecording();
            this.cleanup();
            onError?.("recording", e.error);
        };

        return recorder;
    }

    private download = () => {
        const blob = new Blob(this.chunks, {
            type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.id = "download-action"
        a.style = "display: none";
        a.href = url;
        document.body.appendChild(a);
        a.download = `${this.sanitiseName(this.donwloadName$.value)}.webm`;
        a.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    private sanitiseName(value: string): string {
        return value.replaceAll(/[._\s]/g, "");
    }

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