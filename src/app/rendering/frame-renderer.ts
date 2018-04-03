import * as _ from "lodash";

import { Rectangle, AxisDimension } from "../game-objects/rectangle";
import { Logger } from "../utilities/logger";
import { IDetector } from "../detectors/detector.interface";
import { Middleware } from "../utilities/middleware";

export interface IRenderable {
    object: Rectangle;
    beforeRender?: IRenderMiddleware[];
    afterRender?: IRenderMiddleware[];
}

export interface IRenderMiddleware {
    (next: Function, obj: Rectangle): void;
}

export class FrameRenderer {

    private renderables: IRenderable[] = [];
    private animationFrame: (x: FrameRequestCallback) => number;
    private animationFrameLoopId: number;

    constructor(private context: CanvasRenderingContext2D, private window: Window, private logger: Logger) {
        this.animationFrame = this.window.requestAnimationFrame;
    }

    public addObject(obj: Rectangle, hooks?: { beforeRender?: IRenderMiddleware[], afterRender?: IRenderMiddleware[] }) {
        this.renderables.push({
            object: obj,
            beforeRender: _.isObject(hooks) ? hooks.beforeRender : undefined,
            afterRender: _.isObject(hooks) ? hooks.afterRender : undefined
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

            const middleware = new Middleware();

            this.context.fillStyle = x.object.getColor();
            this.context.fillRect(position.x, position.y, dimensions.width, dimensions.height);

            middleware.use((next: Function) => {
                next(x.object);
            });

            if (_.isArray(x.beforeRender) && x.beforeRender.length > 0) {
                x.beforeRender.forEach(y => middleware.use(y))
            }

            middleware.use((next: Function) => {
                x.object.update();
                next(x.object);
            });

            if (_.isArray(x.afterRender) && x.afterRender.length > 0) {
                x.afterRender.forEach(y => middleware.use(y))
            }

            middleware.go(() => {
                
            });
        });
    }
}