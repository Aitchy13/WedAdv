export class MouseInputEvent implements EventListenerObject {

    public event: MouseEvent;

    constructor(private callback: (evt: MouseInputEvent) => void) {}

    public handleEvent(evt: MouseEvent) {
        this.event = evt;
        this.callback(this);
    }
}

export class MouseInput {

    constructor(private canvas: HTMLCanvasElement) {

    }

    public onMouseOver(callback: (evt: MouseInputEvent) => void) {
        const inputEvent = new MouseInputEvent(callback);
        this.canvas.addEventListener("mouseover", inputEvent);
    }

    public onMouseEnter(callback: (evt: MouseInputEvent) => void) {
        const inputEvent = new MouseInputEvent(callback);
        this.canvas.addEventListener("mouseenter", inputEvent);
    }

    public onMouseLeave(callback: (evt: MouseInputEvent) => void) {
        const inputEvent = new MouseInputEvent(callback);
        this.canvas.addEventListener("mouseleave", inputEvent);
    }

    public onMouseOut(callback: (evt: MouseInputEvent) => void) {
        const inputEvent = new MouseInputEvent(callback);
        this.canvas.addEventListener("mouseout", inputEvent);
    }

    public onMouseMove(callback: (evt: MouseInputEvent) => void) {
        const inputEvent = new MouseInputEvent(callback);
        this.canvas.addEventListener("mousemove", inputEvent);
    }

    public onClick(callback: (evt: MouseInputEvent) => void) {
        const inputEvent = new MouseInputEvent(callback);
        this.canvas.addEventListener("click", inputEvent);
    }

}