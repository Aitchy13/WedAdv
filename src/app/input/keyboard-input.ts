export class KeyboardInputEvent implements EventListenerObject {

    public event: KeyboardEvent;

    constructor(private callback: (evt: KeyboardInputEvent) => void) {}

    public handleEvent(evt: KeyboardEvent) {
        this.event = evt;
        this.callback(this);
    }
}

export class KeyboardInput {

    constructor() {

    }

    public onKeyDown(callback: (evt: KeyboardInputEvent) => void) {
        const inputEvent = new KeyboardInputEvent(callback);
        document.addEventListener("keydown", inputEvent, false);
    }

    public onKeyUp(callback: (evt: KeyboardInputEvent) => void) {
        const inputEvent = new KeyboardInputEvent(callback);
        document.addEventListener("keyup", inputEvent, false);
    }

}