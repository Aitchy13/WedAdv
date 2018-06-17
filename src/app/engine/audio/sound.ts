import axios from "axios";

interface ISoundLoadResponse {
    buffer: AudioBuffer,
    source: AudioBufferSourceNode
};

export class Sound {

    private context: AudioContext;
    private source: AudioBufferSourceNode;
    private playing: boolean = false;
    private started: boolean = false;
    private buffer: AudioBuffer;
    private loadingPromise: Promise<ISoundLoadResponse>;

    constructor(public readonly key: string, public readonly path: string) {
        (window as any).AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        this.context = new AudioContext();
    }

    public play(startTime: number = 0, stopTime?: number): Promise<void> {
        if (this.playing || this.started) {
            this.stop();
        }
        return this.load().then(() => {
            this.source.start(startTime);
            if (stopTime) {
                this.source.stop(this.context.currentTime + stopTime);
            }
            this.playing = true;
        });
    }

    public loop(): Promise<void> {
        if (this.playing) {
            return Promise.resolve();
        }
        return this.load().then(() => {
            this.source.loop = true;
            this.source.start();
            this.playing = true;
        })
    }

    public stop(): Promise<void> {
        if (this.playing || this.started) {
            this.source.stop();
            this.playing = false;
            return;
        }
    }

    public load(): Promise<ISoundLoadResponse> {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        this.loadingPromise = axios.get<ArrayBuffer>(this.path, {
            responseType: "arraybuffer"
        }).then(response => {
            return this.context.decodeAudioData(response.data);
        }).then(buffer => {
            this.buffer = buffer;
            return this.initSource(buffer);
        }).then(() => {
            this.loadingPromise = undefined;
            return {
                buffer: this.buffer,
                source: this.source
            };
        }).catch((e: Error) => {
            return Promise.reject(e);
        })
        return this.loadingPromise;
    }

    public destroy() {
        if (this.source) {
            this.source.disconnect();
        }
    }

    private initSource(buffer: AudioBuffer): AudioBufferSourceNode {
        this.source = this.context.createBufferSource();
        this.source.buffer = buffer;
        this.source.connect(this.context.destination);
        this.source.onended = () => {
            this.playing = false;
        }
        return this.source;
    }
    
}