import { BehaviorSubject } from "rxjs";
import { SignaliumBureau } from "../signalium-bureau";

/**
 * Records the videos.
 */
export class ChronoLens {
    private signaliumBureau: SignaliumBureau
    private recorder: MediaRecorder | undefined;
    private stream: MediaStream | undefined;
    private chunks: Blob[] = [];

    public isRecording$ = new BehaviorSubject(false);
    public isPlaying$ = new BehaviorSubject(false);

    public constructor(signaliumBureau: SignaliumBureau) {
        this.signaliumBureau = signaliumBureau;
        
        this.isRecording$.subscribe((isRecording) => {
            if (isRecording) {
                this.startRecording();
            } else {
                this.stopRecording();
            }
        });
    }

    private startRecording = async (
        onError?: (e: ErrorEvent) => void,
    ) => {
        if (!this.recorder) {
            await this.setup(onError);
        }
        this.recorder?.start();
        this.isPlaying$.next(true);
    };

    private stopRecording = () => {
        this.recorder?.stop();
        for (const track of this.stream?.getTracks() ?? []) {
            track.stop();
        }
        this.isPlaying$.next(false);
    };

    private setup = async (
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
            this.recorder = this.setupRecording(stream, onError);
        } catch (err) {
            console.error(err);
            // TODO: Add notification
        }
    }

    private setupRecording = (
        stream: MediaStream,
        onError?: (e: ErrorEvent) => void,
    ): MediaRecorder => {
        const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9",
        });

        recorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
        }

        recorder.onstop = () => {
            const blob = new Blob(this.chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            this.download(url);
            this.chunks = [];
        };

        if (onError) {
            recorder.onerror = onError;
        }

        return recorder;
    };

    private download = (url: string) => {
        const a = document.createElement("a");
        a.id="test-anchor"
        a.href = url;
        a.download = "animation.webm";
        a.click();
        console.log(a)
        // document.removeChild(a);
    };
}