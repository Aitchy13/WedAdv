export enum AxisDimension {
    None,
    X,
    Y,
    XY
}

export class PhysicalObject {

    private x: number = 0;
    private y: number = 0;

    private xVelocity: number = 0;
    private yVelocity: number = 0;

    constructor(private width: number, private height: number, x?: number, y?: number) { }

    public getPosition() {
        return {
            x: this.x,
            y: this.y
        };
    }

    public getDimensions() {
        return {
            width: this.width,
            height: this.height
        }
    }

    public setSpeed(dimension: AxisDimension, value: number) {
        switch (dimension) {
            case AxisDimension.X:
                this.xVelocity = value;
                break;
            case AxisDimension.Y:
                this.yVelocity = value;
                break;
            case AxisDimension.XY:
                this.xVelocity = value;
                this.yVelocity = value;
                break;
            default:
                throw new Error("Unsupported axis dimension");
        }
        return this;
    }

    public update() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }

}