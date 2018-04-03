import * as _ from "lodash";

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
        const greenCube = new Rectangle(50, 50, 100, 0);
        greenCube.setVelocity(AxisDimension.X, 0)
            .setColor("green");

        const redCube = new Rectangle(50, 50, this.canvas.width - 50, 100);
        redCube.setVelocity(AxisDimension.X, -5)
            .setColor("red");

        const logger = new Logger();
        const keyboardInput = new KeyboardInput();
        keyboardInput.onKeyDown((evt) => {
            const sensitivity = 1;
            switch (evt.event.key) {
                case "w":
                case "ArrowUp":
                    greenCube.adjustVelocity(AxisDimension.Y, -sensitivity);
                    break;
                case "s":
                case "ArrowDown":
                    greenCube.adjustVelocity(AxisDimension.Y, sensitivity);
                    break;
                case "a":
                case "ArrowLeft":
                    greenCube.adjustVelocity(AxisDimension.X, -sensitivity);
                    break;
                case "d":
                case "ArrowRight":
                    greenCube.adjustVelocity(AxisDimension.X, sensitivity);
                    break;
            }
        });

        const renderer = new FrameRenderer(this.getContext(), this.window, logger);

        renderer.addObject(greenCube, {
            beforeRender: [
                (next, currentObj) => {
                    const collidedObjects = new CollisionDetector(currentObj, redCube, (detectingObject, collidedObject) => {
                        const currentVelocity = detectingObject.getVelocity();
                        if (currentVelocity.x < 0) {
                            detectingObject.x = detectingObject.x - 1;
                        } else {
                            detectingObject.x = detectingObject.x + 1;
                        }
                        if (currentVelocity.y < 0) {
                            detectingObject.y = detectingObject.y - 1;
                        } else {
                            detectingObject.y = detectingObject.y + 1;
                        }
                        detectingObject.setVelocity(AxisDimension.XY, 0);
                        collidedObject.setVelocity(AxisDimension.XY, 0);
                    }).detect();
                    if (collidedObjects.length > 0) return;
                    next(currentObj);
                },
                (next, currentObj) => {
                    logger.log(currentObj.getPosition());
                    next();
                }
            ]
        });
        renderer.addObject(redCube);
        renderer.start();
    }

    public getContext() {
        return this.canvas.getContext("2d");
    }

}