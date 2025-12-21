import { BehaviorSubject } from "rxjs";

/**
 * Records the videos.
 */
export class ChronoLens {
    private recorder: MediaRecorder | undefined;
    private stream: MediaStream | undefined;
    private chunks: Blob[] = [];

    public isRecording$ = new BehaviorSubject(false);
    public isPlaying$ = new BehaviorSubject(false);

    public constructor() {
        this.isRecording$.subscribe((isRecording) => {
            this.isPlaying$.next(isRecording);
            if (isRecording) {
                this.startRecording();
            } else {
                this.stopRecording();
            }
        });
    }

    private startRecording = async () => {
        if (!this.recorder) {
            await this.setup();
        }
        this.recorder?.start();
    };

    private stopRecording = () => {
        this.recorder?.stop();
        for (const track of this.stream?.getTracks() ?? []) {
            track.stop();
        }
    };

    private setup = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: 30
                },
                audio: false
            })
            this.stream = stream;
            this.recorder = this.setupRecording(stream);
        } catch (err) {
            console.error(err);
            // TODO: Add notification
        }
    }

    private setupRecording = (stream: MediaStream): MediaRecorder => {
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

        return recorder;
    };

    private download = (url: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "animation.webm";
        a.click();
        document.removeChild(a);
    };
}