import * as _ from "lodash";

import { Logger } from "../utilities/logger";
import { IDetector } from "../detectors/detector.interface";
import { Middleware } from "../utilities/middleware";
import { Time } from "../utilities/time";
import { Tween } from "../animation/tween";
import { Camera } from "./camera";

export interface IRenderable {
    render(ctx?: CanvasRenderingContext2D, delta?: number): void;
    beforeRender(ctx?: CanvasRenderingContext2D, delta?: number): void;
    afterRender(ctx?: CanvasRenderingContext2D, delta?: number): void;
}

export class Renderer {

    private renderables: IRenderable[] = [];
    private animationFrame: (x: FrameRequestCallback) => number;
    private animationFrameLoopId: number;

    constructor(private context: CanvasRenderingContext2D, private window: Window, private logger: Logger, private time: Time, private camera: Camera) {
        this.animationFrame = this.window.requestAnimationFrame;
        this.camera.ctx = this.context;
    }

    public addObject(obj: IRenderable) {
        this.renderables.push(obj);
    }

    public removeObject(obj: IRenderable) {
        const index = _.findIndex(this.renderables, x => x === obj);
        if (index === -1) {
            return;
        }
        this.renderables.splice(index, 1);
    }

    public findRenderable(obj: IRenderable) {
        return _.find(this.renderables, x => x === obj);
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
        this.camera.update();
        this.renderables.forEach(x => {
            x.beforeRender(this.context, timeDelta);
            x.render(this.context, timeDelta);
            x.afterRender(this.context, timeDelta);
        });
    }
}