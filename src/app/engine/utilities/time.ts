export class Time {

    public delta: number;

    private now: number;
    private then: number;

    constructor() {
        this.setDelta();
    }

    public setDelta() {
        this.now = Date.now();
        this.delta = (this.now - this.then) / 1000;
        this.then = this.now;
        return this;
    }

}