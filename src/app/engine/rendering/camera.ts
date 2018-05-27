import { Vector } from "../core/vector";

export class Camera {

    public ctx: CanvasRenderingContext2D;

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

    public follow(position: () => Vector) {
        this.followRef = position;
    }

    public update() {
        if (!this.followRef) {
            return;
        }
        let x = this.enforceBoundary(-this.followRef().x + (this.width / 2), this.minX, this.maxX);
        let y = this.enforceBoundary(-this.followRef().y + (this.height / 2), this.minY, this.maxY);

        this.ctx.translate(x, y);
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