import * as _ from "lodash";

import { Shape } from "../game-objects/shape";
import { Logger } from "../utilities/logger";
import { IDetector } from "../detectors/detector.interface";
import { Middleware } from "../utilities/middleware";
import { Time } from "../utilities/time";
import { Tween } from "../animation/tween";
import { Camera } from "./camera";

export interface IRenderConfig {
    object: IRenderable;
    beforeRender?: IRenderMiddleware[];
    afterRender?: IRenderMiddleware[];
}

export interface IRenderable {
    render(ctx?: CanvasRenderingContext2D, delta?: number): void;
}

export interface IRenderMiddleware {
    (next: Function, obj: Shape): void;
}

export class FrameRenderer {

    private renderables: IRenderConfig[] = [];
    private animationFrame: (x: FrameRequestCallback) => number;
    private animationFrameLoopId: number;

    constructor(private context: CanvasRenderingContext2D, private window: Window, private logger: Logger, private time: Time, private camera: Camera) {
        this.animationFrame = this.window.requestAnimationFrame;
        this.camera.ctx = this.context;
    }

    public addObject(obj: IRenderable, hooks?: { beforeRender?: IRenderMiddleware[], afterRender?: IRenderMiddleware[] }) {
        this.renderables.push({
            object: obj,
            beforeRender: _.isObject(hooks) ? hooks.beforeRender : undefined,
            afterRender: _.isObject(hooks) ? hooks.afterRender : undefined
        });
    }

    public removeObject(obj: IRenderable) {
        const index = _.findIndex(this.renderables, x => x.object === obj);
        if (index === -1) {
            return;
        }
        this.renderables.splice(index, 1);
    }

    public findRenderable(obj: IRenderable) {
        return _.find(this.renderables, x => x.object === obj);
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
        const timeDelta = this.time.setDelta().delta;
        Tween.update(timeDelta);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        // this.context.fillStyle = "";
        this.camera.update();
        this.renderables.forEach(x => {
            const middleware = new Middleware();

            middleware.use((next: Function) => {
                next(x.object);
            });

            if (_.isArray(x.beforeRender) && x.beforeRender.length > 0) {
                x.beforeRender.forEach(y => middleware.use(y))
            }

            middleware.use((next: Function) => {
                x.object.render(this.context, timeDelta);
                next(x.object);
            });

            if (_.isArray(x.afterRender) && x.afterRender.length > 0) {
                x.afterRender.forEach(y => middleware.use(y))
            }

            middleware.go(() => {});
        });
    }
}