import * as _ from "lodash";

export class KeyboardInputEvent implements EventListenerObject {

    public event: KeyboardEvent;

    constructor(private callback: (evt: KeyboardInputEvent) => void, public readonly activeKeys: string[]) {}

    public handleEvent(evt: KeyboardEvent) {
        this.event = evt;
        this.callback(this);
    }
}

export class KeyboardInput {

    public readonly activeKeys: string[] = [];

    constructor() {
        this.onKeyDown((evt) => {
            this.activeKeys.push(evt.event.key);
        });
        this.onKeyUp((evt) => {
            const index = _.findIndex(this.activeKeys, x => x === evt.event.key);
            if (index !== -1) {
                this.activeKeys.splice(index, 1);
            }
        });
    }

    public onKeyDown(callback: (evt: KeyboardInputEvent) => void) {
        const inputEvent = new KeyboardInputEvent(callback, this.activeKeys);
        document.addEventListener("keydown", inputEvent, false);
    }

    public onKeyUp(callback: (evt: KeyboardInputEvent) => void) {
        const inputEvent = new KeyboardInputEvent(callback, this.activeKeys);
        document.addEventListener("keyup", inputEvent, false);
    }

}