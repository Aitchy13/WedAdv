import { PhysicalObject, AxisDimension } from "./physical-object";
import { FrameRenderer } from "./frame-renderer";
import { Logger } from "./logger";

export class App {

    private canvas: HTMLCanvasElement;

    constructor(private document: Document, private window: Window) {

    }

    public initialise() {
        this.canvas = this.document.getElementById("game-screen") as HTMLCanvasElement;
        this.canvas.width = this.window.innerWidth;
        this.canvas.height = this.window.innerHeight;

        // TESTING
        const testObj = new PhysicalObject(50, 50, 200, 200);
        testObj.setSpeed(AxisDimension.Y, 1);

        const logger = new Logger();

        const renderer = new FrameRenderer(this.getContext(), this.window, logger);

        renderer.addObject(testObj);
        renderer.start();
    }

    public getContext() {
        return this.canvas.getContext("2d");
    }

}