import * as TWEEN from "@tweenjs/tween.js";

import { Vector } from "../core/vector";
import { IMoveable, PositionStrategy } from "../physics/moveable";
import { Easing, IEasingFunc } from "./easing";

export type TweenEventName = "start" | "stop" | "update" | "complete";

export class Tween {

    public extTweenObj: TWEEN.Tween;
    public position: Vector;
    public destination: Vector;

    private eventHandlers: {
        "start": Function[];
        "stop": Function[];
        "update": Function[];
        "complete": Function[];
    };

    constructor(private moveable: IMoveable, startingPosition?: Vector) {
        this.position = startingPosition ? startingPosition.copy() : new Vector(moveable.x, moveable.y);
        this.extTweenObj = new TWEEN.Tween(this.position);
        this.bindEventHandlers();
    }

    public start() {
        this.extTweenObj.start();
        return this;
    }

    public stop() {
        this.extTweenObj.stop();
        return this;
    }

    public to(coord: Vector, duration: number = 700, easing: IEasingFunc = Easing.linear) {
        this.destination = coord.copy();
        this.extTweenObj
            .to({ x: coord.x, y: coord.y }, duration)
            .easing(easing);
        this.on("update", () => {
            this.moveable.move(this.position.x, this.position.y, PositionStrategy.Absolute);
        })
        return this;
    }

    public on(eventName: TweenEventName, callback: (...args: any[]) => void) {
        this.eventHandlers[eventName].push(callback);
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

    private bindEventHandlers() {
        this.eventHandlers = {
            "start": [],
            "stop": [],
            "update": [],
            "complete": []
        };
        const triggerEventHandlers = (eventName: TweenEventName, evtObj: any) => {
            if (this.eventHandlers[eventName].length === 0) {
                return;
            }
            for (const handler of this.eventHandlers[eventName]) {
                handler(evtObj, this.destination);
            }
        }
        this.extTweenObj.onStart((currentPosition) => {
            triggerEventHandlers("start", currentPosition);
        });
        this.extTweenObj.onUpdate((currentPosition) => {
            triggerEventHandlers("update", currentPosition);
        });
        this.extTweenObj.onComplete((currentPosition) => {
            triggerEventHandlers("complete", currentPosition);
        });
        this.extTweenObj.onStop((currentPosition) => {
            triggerEventHandlers("stop", currentPosition);
        });
    }

}