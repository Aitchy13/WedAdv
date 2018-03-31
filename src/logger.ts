export class Logger {

    constructor() {}

    public log(...args: any[]) {
        console.log.apply(this, args)
    }

}