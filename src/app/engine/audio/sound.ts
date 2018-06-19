import axios from "axios";

export class Sound {

    private context: AudioContext;
    private source: AudioBufferSourceNode;
    private buffer: AudioBuffer;
    private loadingPromise: Promise<AudioBuffer>;
    private ended: boolean = false;

    constructor(public readonly key: string, public readonly path: string) {
        (window as any).AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        this.context = new AudioContext();
    }

    public play(startTime: number = 0, stopTime?: number) {
        try {
            if (!this.buffer) {
                throw new Error("Load the sound before playing");
            }
            if (this.source) {
                this.stop();
            }
            this.initSource(this.buffer);
            this.source.start(startTime);
            if (stopTime) {
                this.source.stop(this.context.currentTime + stopTime);
            }
        } catch (e) {
            console.error(e);
        }
    }

    public loop() {
        try {
            if (!this.buffer) {
                throw new Error("Load the sound before playing");
            }
            if (this.source) {
                this.stop();
            }
            this.initSource(this.buffer);
            this.source.loop = true;
            this.source.start();
        } catch (e) {
            console.error(e);
        }
    }

    public stop(){
        try {
            if (!this.source) {
                return;
            }
            this.source.stop();
        } catch (e) {
            console.error(e);
        }
        
    }

    public load(): Promise<AudioBuffer> {
        try {
            if (this.loadingPromise) {
                return this.loadingPromise;
            }
            this.loadingPromise = axios.get<ArrayBuffer>(this.path, {
                responseType: "arraybuffer"
            }).then(response => {
                return this.context.decodeAudioData(response.data);
            }).then(buffer => {
                this.buffer = buffer;
            }).then(() => {
                this.loadingPromise = undefined;
                return this.buffer;
            }).catch((e: Error) => {
                return Promise.reject(e);
            })
            return this.loadingPromise;
        } catch (e) {
            console.error(e);
        }
    }

    public destroy() {
        if (this.source) {
            this.source.disconnect();
        }
    }

    private initSource(buffer: AudioBuffer): AudioBufferSourceNode {
        this.source = this.context.createBufferSource();
        this.source.buffer = buffer;
        this.source.onended = () => {
            this.ended = true;
        }
        this.source.connect(this.context.destination);
        return this.source;
    }
    
}