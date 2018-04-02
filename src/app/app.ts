import { Rectangle, AxisDimension } from "./game-objects/rectangle";
import { FrameRenderer } from "./rendering/frame-renderer";
import { Logger } from "./utilities/logger";
import { CollisionDetector } from "./detectors/collision-detector";
import { KeyboardInput } from "./input/keyboard-input";

export class App {

    private canvas: HTMLCanvasElement;

    constructor(private document: Document, private window: Window) {

    }

    public initialise(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = this.window.innerWidth;
        this.canvas.height = this.window.innerHeight;

        // TESTING
        const obj1 = new Rectangle(50, 50, 0, 0);
        obj1.setVelocity(AxisDimension.X, 0)
            .setColor("green");

        const obj2 = new Rectangle(50, 50, this.canvas.width - 50, 0);
        obj2.setVelocity(AxisDimension.X, -5)
            .setColor("red");

        const logger = new Logger();
        const keyboardInput = new KeyboardInput();
        keyboardInput.onKeyDown((evt) => {
            const sensitivity = 1;
            switch (evt.event.key) {
                case "w":
                case "ArrowUp":
                    obj1.adjustVelocity(AxisDimension.Y, -sensitivity);
                    break;
                case "s":
                case "ArrowDown":
                    obj1.adjustVelocity(AxisDimension.Y, sensitivity);
                    break;
                case "a":
                case "ArrowLeft":
                    obj1.adjustVelocity(AxisDimension.X, -sensitivity);
                    break;
                case "d":
                case "ArrowRight":
                    obj1.adjustVelocity(AxisDimension.X, sensitivity);
                    break;
            }
        });

        const renderer = new FrameRenderer(this.getContext(), this.window, logger);

        renderer.addObject(obj1, [new CollisionDetector(obj1, obj2, (x, y) => {
            x.setVelocity(AxisDimension.XY, 0);
            y.setVelocity(AxisDimension.XY, 0);
        })]);
        renderer.addObject(obj2);
        renderer.start();
    }

    public getContext() {
        return this.canvas.getContext("2d");
    }

}