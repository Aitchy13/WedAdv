export class Countdown {

    public timeRemaining: number = 0;

    private intervalId: any;


    constructor(private countFromSecs: number) {

    }

    public start() {
        this.intervalId = setInterval(() => {
            this.countFromSecs--;
            if (this.countFromSecs === 0) {
                this.stop();
            }
        }, 1000);
    }

    public add(secs: number) {
        this.countFromSecs += Math.floor(secs);
    }

    public subtract(secs: number) {
        this.countFromSecs -= Math.floor(secs);
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    public getFormatted(): string {
        const minutes = Math.floor(this.countFromSecs / 60);
        const seconds = this.countFromSecs - minutes * 60;
        const zeroedSeconds = seconds < 10 ? `${0}seconds` : seconds;
        return `${minutes}:${zeroedSeconds}`;
    }

}