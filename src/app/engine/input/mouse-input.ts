import * as _ from "lodash";

export class MouseInputEvent implements EventListenerObject {

    public event: MouseEvent;

    constructor(public callback: (evt: MouseInputEvent) => void) {}

    public handleEvent(evt: MouseEvent) {
        this.event = evt;
        this.callback(this);
    }
}

export type MouseEventName = "mouseover" | "mouseenter" | "mouseleave" | "mouseout" | "mousemove" | "click";

export class MouseInput {

    private inputEvents: MouseInputEvent[] = [];

    constructor(private canvas: HTMLCanvasElement) {

    }

    public on(eventName: MouseEventName, callback: (evt: MouseInputEvent) => void) {
        const inputEvent = new MouseInputEvent(callback);
        this.inputEvents.push(inputEvent);
        this.canvas.addEventListener(eventName, inputEvent);
    }

    public unbind(eventName: MouseEventName, callback: (evt: MouseInputEvent) => void) {
        const index = _.findIndex(this.inputEvents, x => x.callback === callback);
        if (index === -1) {
            throw new Error("Callback not found");
        }
        const inputEvent = this.inputEvents[index];
        this.canvas.removeEventListener(eventName, inputEvent);
        this.inputEvents.splice(index, 1);
    }

}