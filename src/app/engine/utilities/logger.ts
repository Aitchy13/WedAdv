export class Logger {

    constructor() {}

    public log(...args: any[]) {
        console.log.apply(this, args)
    }

    public info(...args: any[]) {
        console.info.apply(this, args)
    }

    public debug(...args: any[]) {
        console.debug.apply(this, args)
    }

    public warn(...args: any[]) {
        console.warn.apply(this, args)
    }

    public error(...args: any[]) {
        console.error.apply(this, args)
    }

}