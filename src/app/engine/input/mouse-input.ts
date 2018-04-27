export class MouseInputEvent implements EventListenerObject {

    public event: KeyboardEvent;

    constructor(private callback: (evt: MouseInputEvent) => void) {}

    public handleEvent(evt: KeyboardEvent) {
        this.event = evt;
        this.callback(this);
    }
}

export class MouseInput {

    constructor(private canvas: HTMLCanvasElement) {

    }

    public onMouseOver(callback: (evt: MouseInputEvent) => void) {
        const inputEvent = new MouseInputEvent(callback);
        this.canvas.addEventListener("mouseover", inputEvent, false);
    }

    public onClick(callback: (evt: MouseInputEvent) => void) {
        const inputEvent = new MouseInputEvent(callback);
        this.canvas.addEventListener("click", inputEvent, false);
    }

}