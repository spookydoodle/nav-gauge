import { BehaviorSubject } from "rxjs";
import { formatTimestamp } from "../../../../tinker-chest/src";
import { FrameRate, SurveillanceState } from "./model";

/**
 * Records the videos.
 */
export class ChronoLens {
    private recorder: MediaRecorder | undefined;
    private stream: MediaStream | undefined;
    private chunks: Blob[] = [];

    /**
     * Frames per second. Defaults to 30.
     */
    public fps$ = new BehaviorSubject<FrameRate>(30);
    // TODO: Combine isPlaing and state?
    public surveillanceState$ = new BehaviorSubject<SurveillanceState>(SurveillanceState.Stopped);
    public isPlaying$ = new BehaviorSubject(false);
    public downloadName$ = new BehaviorSubject('Voyage Log');

    public constructor() { }

    public startRecording = async (
        canvas: HTMLCanvasElement,
        onError?: (stage: string, error: Error) => void
    ) => {
        this.isPlaying$.next(true);
        if (!this.recorder) {
            await this.setup(canvas, onError);
        }
        this.recorder?.start();
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

    private setup = async (
        canvas?: HTMLCanvasElement,
        onError?: (stage: string, error: Error) => void
    ) => {
        try {
            this.stream = await this.createStream(canvas);
            this.recorder = this.createRecorder(this.stream, onError);
        } catch (error) {
            this.isPlaying$.next(false);
            this.surveillanceState$.next(SurveillanceState.Stopped);
            this.destroyRecording();
            onError?.("setup", error as Error);
        }
    }

    private createStream = async (
        canvas?: HTMLCanvasElement,
    ): Promise<MediaStream> => {
        if (canvas) {
            return canvas.captureStream(this.fps$.value);
        }
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                frameRate: this.fps$.value
            },
            audio: false
        })
        const [videoTrack] = stream.getVideoTracks();

        const handler = () => {
            this.destroyRecording();
            videoTrack.removeEventListener("ended", handler)
        };
        videoTrack.addEventListener("ended", handler);

        return stream;
    };

    private createRecorder = (
        stream: MediaStream,
        onError?: (stage: string, error: Error) => void
    ): MediaRecorder => {
        const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9",
        });

        recorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
        }

        recorder.onpause = () => { }
        recorder.onresume = () => { }

        recorder.onstop = () => {
            this.stop();
            this.download();
            this.destroyRecording();
        };

        recorder.onerror = (event) => {
            this.destroyRecording();
            onError?.("recording", event.error);
        };

        return recorder;
    }

    private stop = () => {
        this.isPlaying$.next(false);
        this.surveillanceState$.next(SurveillanceState.Stopped);
    };

    private download = () => {
        const timestamp = formatTimestamp(new Date().valueOf(), 0);
        const blob = new Blob(this.chunks, {
            type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.id = "download-action"
        a.style = "display: none";
        a.href = url;
        document.body.appendChild(a);
        a.download = `${this.sanitiseName(this.downloadName$.value + timestamp)}.webm`;
        a.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    private sanitiseName(value: string): string {
        return value.replaceAll(/[.:_\s]/g, "");
    }

    /**
     * Resets the recorder and stream completely.
     */
    public destroyRecording = () => {
        this.recorder?.stop();

        for (const track of this.stream?.getTracks() ?? []) {
            track.stop();
        }

        this.stream = undefined;
        this.recorder = undefined;
        this.chunks = [];
    };
}