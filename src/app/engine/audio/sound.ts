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
        try {
            if (this.playing || this.started) {
                this.stop();
            }
            return this.load().then(() => {
                if (this.playing || this.started)  {
                    return;
                }
                this.source.start(startTime);
                if (stopTime) {
                    this.source.stop(this.context.currentTime + stopTime);
                }
                this.playing = true;
            });
        } catch (e) {
            console.error(e);
        }
    }

    public loop(): Promise<void> {
        try {
            if (this.playing) {
                return Promise.resolve();
            }
            return this.load().then(() => {
                this.source.loop = true;
                if (this.playing) {
                    return;
                }
                this.source.start();
                this.playing = true;
            });
        } catch (e) {
            console.error(e);
        }
    }

    public stop(): Promise<void> {
        try {
            // if (this.playing || this.started) {
                this.source.stop();
                this.playing = false;
                return Promise.resolve();
            // }
        } catch (e) {
            console.error(e);
        }
        
    }

    public load(): Promise<ISoundLoadResponse> {
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
        this.source.connect(this.context.destination);
        return this.source;
    }
    
}