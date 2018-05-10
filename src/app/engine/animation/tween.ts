import * as TWEEN from "@tweenjs/tween.js";

import { Vector } from "../game-objects/vector";
import { IMoveable, PositionStrategy } from "../physics/moveable";
import { Easing } from "./easing";

export enum TweenEasing {
    Linear
};

export type TweenEventName = "start" | "stop" | "update" | "complete";

export class Tween {

    public extTweenObj: TWEEN.Tween;
    private position: Vector;

    constructor(private moveable: IMoveable) {
        this.position = this.moveable.origin;
        this.extTweenObj = new TWEEN.Tween(this.position);
    }

    public start() {
        this.extTweenObj.start();
        return this;
    }

    public stop() {
        this.extTweenObj.stop();
        return this;
    }

    public to(coord: Vector, duration: number = 700, easing: (t: number) => number = Easing.linear) {
        this.extTweenObj
            .to({ x: coord.x, y: coord.y }, duration)
            .easing(easing);
        this.on("update", () => {
            this.moveable.move(this.position.x, this.position.y, PositionStrategy.Absolute);
        })
        return this;
    }

    public on(eventName: TweenEventName, callback: (object?: any) => void) {
        switch (eventName) {
            case "start":
                this.extTweenObj.onStart(callback);
                break;
            case "stop":
                this.extTweenObj.onStop(callback);
                break;
            case "update":
                this.extTweenObj.onUpdate(callback);
                break;
            case "complete":
                this.extTweenObj.onUpdate(callback);
                break;
            default:
                throw new Error(`${eventName} is not a supported event`);
        }
        return this;
    }

    public chain(tween: Tween) {
        this.extTweenObj.chain(tween.extTweenObj);
        return this;
    }

    public repeat(amount?: number) {
        this.extTweenObj.repeat(amount ? amount : Infinity);
        return this;
    }

    public repeatDelay(duration: number = 1000) {
        this.extTweenObj.repeatDelay(duration);
        return this;
    }

    public yoyo(enable: boolean = true) {
        this.extTweenObj.yoyo(enable);
        return this;
    }

    public delay(duration: number = 1000) {
        this.extTweenObj.delay(duration);
        return this;
    }

    public static update(delta?: number) {
        TWEEN.update();
    }

}