import axios from "axios";

export class Sound {

    private context: AudioContext;
    private source: AudioBufferSourceNode;
    private isPlaying : boolean = false;
    private buffer: AudioBuffer;

    private playing: boolean = false;

    constructor(public readonly key: string, public readonly path: string) {
        (window as any).AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        this.context = new AudioContext();
    }

    public play(startTime: number = 0, stopTime?: number) {
        if (this.playing) {
            return;
        }
        return this.load().then(() => {
            this.source.start(startTime);
            if (stopTime) {
                this.source.stop(this.context.currentTime + stopTime);
            }
            this.playing = true;
        });
    }

    public loop() {
        if (this.playing) {
            return;
        }
        return this.load().then(() => {
            this.source.loop = true;
            this.source.start();
            this.playing = true;
        })
    }

    public stop() {
        if (!this.source || !this.playing) {
            return;
        }
        this.source.stop();
    }

    public load() {
        if (this.buffer && this.source) {
            if (this.playing) {
                this.source.stop();
            }
            this.source.disconnect();

            this.source = this.context.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.context.destination);
            this.source.onended = () => {
                this.playing = false;
            }
            this.isPlaying = true;
            return Promise.resolve(this.initialiseSource(this.buffer));
        }
        return axios.get<ArrayBuffer>(this.path, {
            responseType: "arraybuffer"
        }).then(response => {
            return this.context.decodeAudioData(response.data);
        }).then(buffer => {
            return this.initialiseSource(buffer);
        }).catch((e: Error) => {
            this.isPlaying = false;
            return Promise.reject(e);
        });
    }

    private initialiseSource(buffer: AudioBuffer) {
        this.buffer = buffer;
        this.source = this.context.createBufferSource();
        this.source.buffer = buffer;
        this.source.connect(this.context.destination);
        this.isPlaying = true;
        this.source.onended = () => {
            this.playing = false;
        }
        return this.source;
    }
    
}