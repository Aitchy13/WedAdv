import * as Hammer from "hammerjs";
import { Canvas } from "../core/canvas";

export type GestureEventName = "swipeup" | "swipedown" | "swipeleft" | "swiperight" | "tap";

export class Gesture {

    private manager: HammerManager;
    private swipeRecognizer: SwipeRecognizer;
    private tapRecognizer: TapRecognizer;

    constructor(canvas: Canvas) {
        this.manager = new Hammer.Manager(canvas.element);
        
        this.swipeRecognizer = new Hammer.Swipe();
        this.tapRecognizer = new Hammer.Tap();

        this.manager.add(this.swipeRecognizer);
        this.manager.add(this.tapRecognizer);
    }

    public on(eventName: GestureEventName, callback: HammerListener) {
        this.manager.on(eventName, callback);
    }

    public off(eventName: GestureEventName, callback: HammerListener) {
        this.manager.off(eventName, callback);
    }

}