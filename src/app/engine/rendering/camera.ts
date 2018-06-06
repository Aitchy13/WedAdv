import { Vector } from "../core/vector";
import { ICoordinate } from "../core/core.models";
import { IEasingFunc, Easing } from "../animation/easing";
import { Tween } from "../animation/tween";

export class Camera {

    public ctx: CanvasRenderingContext2D;
    public x: number;
    public y: number;

    private followRef: () => Vector;
    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;

    constructor(public width: number, public height: number) {
        this.x = this.enforceBoundary(this.width / 2, this.width - this.maxX, this.minX);
        this.y = this.enforceBoundary(this.height / 2, this.height - this.maxY, this.minY);
    }

    public setBoundaries(minX: number, maxX: number, minY: number, maxY: number): void {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    public removeBoundaries(): void {
        this.minX = undefined;
        this.maxX = undefined;
        this.minY = undefined;
        this.maxY = undefined;
    }

    public follow(position: () => Vector): void {
        this.followRef = position;
    }

    public moveTo(coordinate: ICoordinate, duration: number = 3000, easing: IEasingFunc = Easing.linear): Promise<ICoordinate> {
        this.followRef = undefined;

        const tween = new Tween(this);

        let x = coordinate.x;
        let y = coordinate.y;

        tween.to(new Vector(x, y), duration, easing);
        tween.start();
        return new Promise((resolve) => {
            tween.on("complete", destination => {
                resolve(destination);
            });
        })
    }

    public update(): void {
        let x: number = this.x;
        let y: number = this.y;

        if (this.followRef) {
            x = this.followRef().x;
            y = this.followRef().y;
        }

        x = x > 0 ? -x : x;
        y = y > 0 ? -y : y;

        x = this.enforceBoundary(x + (this.width / 2), this.width - this.maxX, this.minX);
        y = this.enforceBoundary(y + (this.height / 2), this.height - this.maxY, this.minY);

        this.ctx.translate(x, y);
    }

    private enforceBoundary(value: number, min: number, max: number): number {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        }
        return value;
    }

}