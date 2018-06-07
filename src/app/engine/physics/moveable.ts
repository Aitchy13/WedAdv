import * as _ from "lodash";

import { Vector } from "../core/vector";
import { Type } from "../core/core.models";
import { Tween } from "../animation/tween";
import { Easing, IEasingFunc } from "../animation/easing";

export enum PositionStrategy {
    Relative,
    Absolute
}

export enum AxisDimension {
    None,
    X,
    Y,
    XY
}

export interface IMoveable {
    x: number;
    y: number;
    xVel: number;
    yVel: number;
    vertices: Vector[];
    move(x: number, y: number, positionStrategy: PositionStrategy): void;
    movePath(path: Vector[], speed?: number, easing?: IEasingFunc, onComplete?: Function, onUpdate?: Function): void;
    getVelocity(): { x: number, y: number };
    setVelocity(dimension: AxisDimension, value: number): this;
    adjustVelocity(dimension: AxisDimension, value: number): this;
}

export function Moveable() {
    return function(target: Type<any>) {
        target.prototype.xVel = _.isNumber(target.prototype.xVel) ? target.prototype.xVel : 0;
        target.prototype.yVel = _.isNumber(target.prototype.yVel) ? target.prototype.yVel : 0;

        target.prototype.move = function(x: number, y: number, positionStrategy: PositionStrategy) {
            x += this.xVel;
            y += this.yVel;
            switch (positionStrategy) {
                case PositionStrategy.Absolute:
                    const differenceX = x - this.vertices[0].x;
                    const differenceY = y - this.vertices[0].y;
                    this.vertices = _.map(this.vertices, v => {
                        return v.addMerge(new Vector(differenceX, differenceY));
                    });
                    break;
                case PositionStrategy.Relative:
                    this.vertices = _.map(this.vertices, v => v.addMerge(new Vector(x, y)));
                    break;
                default:
                    throw new Error("Unsupported position strategy");
            }
            this.x = this.vertices[0].x;
            this.y = this.vertices[0].y;
        }

        target.prototype.movePath = function(path: Vector[], speed: number = 1000, easing: IEasingFunc = Easing.linear, onComplete?: Function, onUpdate?: Function, onStart?: Function): void {
            let i = path.length;
            if (!path || path.length < 2) {
                throw new Error("Path invalid");
            }
            const lastTween = new Tween(this).to(path[path.length - 2], speed, easing);
            lastTween.on("update", () => {
                this.move(this.x, this.y, PositionStrategy.Absolute);
            });
            if (_.isFunction(onUpdate)) {
                lastTween.on("complete", onUpdate);
                lastTween.on("start", onUpdate);
            }
            if (_.isFunction(onComplete)) {
                lastTween.on("complete", onComplete);
            }
            const tween = _.reduceRight(path, (rightTween: Tween) => {
                if (i === path.length || i <= 0) {
                    i--;
                    return rightTween;
                }
                rightTween.on("update", () => {
                    this.move(this.x, this.y, PositionStrategy.Absolute);
                });
                if (_.isFunction(onUpdate)) {
                    rightTween.on("start", onUpdate);
                }
                if (_.isFunction(onUpdate)) {
                    rightTween.on("complete", onUpdate);
                }
                const leftTween = new Tween(this).to(path[i--], speed, easing);
                leftTween.chain(rightTween);
                return leftTween;
            }, lastTween);
            if (_.isFunction(onStart)) {
                tween.on("start", onStart);
            }
            tween.start();
        }

        target.prototype.getVelocity = function() {
            return {
                x: this.xVel,
                y: this.yVel
            };
        }
    
        target.prototype.setVelocity = function(dimension: AxisDimension, value: number) {
            switch (dimension) {
                case AxisDimension.X:
                    this.xVel = value;
                    break;
                case AxisDimension.Y:
                    this.yVel = value;
                    break;
                case AxisDimension.XY:
                    this.xVel = value;
                    this.yVel = value;
                    break;
                default:
                    throw new Error("Unsupported axis dimension");
            }
            return this;
        }
    
        target.prototype.adjustVelocity = function(dimension: AxisDimension, value: number) {
            const velocity = this.getVelocity();
            switch (dimension) {
                case AxisDimension.X:
                    this.setVelocity(AxisDimension.X, velocity.x + value);
                    break;
                case AxisDimension.Y:
                    this.setVelocity(AxisDimension.Y, velocity.y + value);
                    break;
                case AxisDimension.XY:
                    this.setVelocity(AxisDimension.X, velocity.x + value);
                    this.setVelocity(AxisDimension.Y, velocity.y + value);
                default:
                    throw new Error("Unsupported dimension specified");
            }
            return this;
        }
    }
}