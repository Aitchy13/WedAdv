import * as _ from "lodash";

export class KeyboardInputEvent implements EventListenerObject {

    public event: KeyboardEvent;

    constructor(public callback: (evt: KeyboardInputEvent) => void, public readonly activeKeys: string[]) {}

    public handleEvent(evt: KeyboardEvent) {
        this.event = evt;
        this.callback(this);
    }
}

export type KeyboardEventName = "keyup" | "keydown";

export class KeyboardInput {

    public readonly activeKeys: string[] = [];
    private inputEvents: KeyboardInputEvent[] = [];

    constructor(private document: Document) {
        this.on("keydown", (evt) => {
            this.activeKeys.push(evt.event.key);
        });
        this.on("keyup", (evt) => {
            const index = _.findIndex(this.activeKeys, x => x === evt.event.key);
            if (index !== -1) {
                this.activeKeys.splice(index, 1);
            }
        });
    }

    public on(eventName: KeyboardEventName, callback: (evt: KeyboardInputEvent) => void) {
        const inputEvent = new KeyboardInputEvent(callback, this.activeKeys);
        this.inputEvents.push(inputEvent);
        document.addEventListener(eventName, inputEvent, false);
    }

    public unbind(eventName: KeyboardEventName, callback: (evt: KeyboardInputEvent) => void) {
        const index = _.findIndex(this.inputEvents, x => x.callback === callback);
        if (index === -1) {
            throw new Error("Callback not found");
        }
        const inputEvent = this.inputEvents[index];
        this.document.removeEventListener(eventName, inputEvent);
        this.inputEvents.splice(index, 1);
    }

}