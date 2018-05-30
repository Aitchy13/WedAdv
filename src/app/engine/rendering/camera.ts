import { Vector } from "../core/vector";
import { ICoordinate } from "../core/core.models";
import { IEasingFunc, Easing } from "../animation/easing";
import { Tween } from "../animation/tween";
import { IMoveable } from "../physics/moveable";

export class Camera {

    public ctx: CanvasRenderingContext2D;
    public x: number = 0;
    public y: number = 0;

    private followRef: () => Vector;
    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;

    constructor(public width: number, public height: number) {

    }

    public setBoundaries(minX: number, maxX: number, minY: number, maxY: number) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    public removeBoundaries() {
        this.minX = undefined;
        this.maxX = undefined;
        this.minY = undefined;
        this.maxY = undefined;
    }

    public follow(position: () => Vector) {
        this.followRef = position;
    }

    public moveTo(coordinate: ICoordinate, duration: number = 3000, easing: IEasingFunc = Easing.linear) {
        this.followRef = undefined;

        const tween = new Tween(this);
        tween.to(new Vector(coordinate.x, coordinate.y), duration, easing);
        tween.start();
        tween.on("complete", (obj) => {
            debugger;
        });
    }

    public update() {
        if (this.followRef) {
            this.x = this.enforceBoundary(-this.followRef().x + (this.width / 2), this.minX, this.maxX);
            this.y = this.enforceBoundary(-this.followRef().y + (this.height / 2), this.minY, this.maxY);
        } else {
            this.x = this.enforceBoundary(-this.x + (this.width / 2), this.minX, this.maxX);
            this.y = this.enforceBoundary(-this.y + (this.height / 2), this.minY, this.maxY);
        }

        this.ctx.translate(this.x, this.y);
    }

    private enforceBoundary(value: number, min: number, max: number) {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        }
        return value;
    }

}