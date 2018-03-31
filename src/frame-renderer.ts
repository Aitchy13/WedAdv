import * as _ from "lodash";

import { PhysicalObject } from "./physical-object";
import { Logger } from "./logger";

export class FrameRenderer {

    private objects: PhysicalObject[] = [];
    private animationFrame: (x: FrameRequestCallback) => number;
    private animationFrameLoopId: number;

    constructor(private context: CanvasRenderingContext2D, private window: Window, private logger: Logger) {
        this.animationFrame = this.window.requestAnimationFrame;
    }

    public addObject(obj: PhysicalObject) {
        this.objects.push(obj);
    }

    public removeObject(obj: PhysicalObject) {
        const index = _.findIndex(this.objects, x => x === obj);
        this.objects.splice(index, 1);
    }

    public start() {
        this.window.requestAnimationFrame(this.start.bind(this));
        this.render();
    }

    public stop() {
        if (this.animationFrameLoopId) {
            this.window.cancelAnimationFrame(this.animationFrameLoopId);
            this.animationFrameLoopId = undefined
        }
    }

    private render() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.objects.forEach(x => {
            const position = x.getPosition();
            const dimensions = x.getDimensions();
            this.context.fillRect(position.x, position.y, dimensions.width, dimensions.height);
            x.update();
        });
    }

}