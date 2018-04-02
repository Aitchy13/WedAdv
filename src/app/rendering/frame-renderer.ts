import * as _ from "lodash";

import { Rectangle, AxisDimension } from "../game-objects/rectangle";
import { Logger } from "../utilities/logger";
import { IDetector } from "../detectors/detector.interface";

export interface IRenderable {
    object: Rectangle;
    detectors?: IDetector[];
}

export class FrameRenderer {

    private renderables: IRenderable[] = [];
    private animationFrame: (x: FrameRequestCallback) => number;
    private animationFrameLoopId: number;

    constructor(private context: CanvasRenderingContext2D, private window: Window, private logger: Logger) {
        this.animationFrame = this.window.requestAnimationFrame;
    }

    public addObject(obj: Rectangle, detector?: IDetector[]) {
        this.renderables.push({
            object: obj,
            detectors: detector
        });
    }

    public removeObject(obj: Rectangle) {
        const index = _.findIndex(this.renderables, x => x.object === obj);
        this.renderables.splice(index, 1);
    }

    public start() {
        this.animationFrameLoopId = this.window.requestAnimationFrame(this.start.bind(this));
        this.render();
    }

    public stop() {
        if (!this.animationFrameLoopId) {
            return;
        }
        this.window.cancelAnimationFrame(this.animationFrameLoopId);
        this.animationFrameLoopId = undefined
    }

    private render() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.renderables.forEach(x => {
            const position = x.object.getPosition();
            const dimensions = x.object.getDimensions();
            this.context.fillStyle = x.object.getColor();
            this.context.fillRect(position.x, position.y, dimensions.width, dimensions.height);
            if (_.isArray(x.detectors)) {
                x.detectors.forEach(y => y.detect())
            }
            x.object.update();
        });
    }
}