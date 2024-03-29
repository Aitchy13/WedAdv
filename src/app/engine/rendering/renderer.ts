import * as _ from "lodash";

import { Logger } from "../utilities/logger";
import { Time } from "../utilities/time";
import { Tween } from "../animation/tween";
import { Camera } from "./camera";

export interface IRenderable {
    y: number;
    render(ctx?: CanvasRenderingContext2D, delta?: number): void;
    beforeRender?(ctx?: CanvasRenderingContext2D, delta?: number): void;
    afterRender?(ctx?: CanvasRenderingContext2D, delta?: number): void;
}

export class Renderer {

    private renderables: IRenderable[] = [];
    private animationFrame: (x: FrameRequestCallback) => number;
    private animationFrameLoopId: number;

    constructor(public context: CanvasRenderingContext2D, private window: Window, private logger: Logger, private time: Time, private camera?: Camera) {
        (this.window as any)["requestAnimFrame"] = this.window.requestAnimationFrame ||
                                            this.window.webkitRequestAnimationFrame;
        if (this.camera) {
            this.camera.ctx = this.context;
        }
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

    public removeAllObjects() {
        this.renderables = [];
    }

    public findRenderable(obj: IRenderable) {
        return _.find(this.renderables, x => x === obj);
    }

    public start() {
        this.animationFrameLoopId = (this.window as any)["requestAnimFrame"](this.start.bind(this));
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
        if (this.camera) {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        if (this.camera) {
            this.camera.update();
        }

        this.renderables = _.orderBy(this.renderables, d => d.y);
        this.renderables.forEach(x => {
            if (x.beforeRender) {
                x.beforeRender(this.context, timeDelta);
            }
            x.render(this.context, timeDelta);
            if (x.afterRender) {
                x.afterRender(this.context, timeDelta);
            }
        });
    }
}