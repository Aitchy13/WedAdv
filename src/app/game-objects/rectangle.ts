import * as _ from "lodash";

export enum AxisDimension {
    None,
    X,
    Y,
    XY
}

export class Rectangle {

    public x: number = 0;
    public y: number = 0;

    public xVel: number = 0;
    public yVel: number = 0;

    public weight: number = 1000;
    private color: string = "#000";

    constructor(public width: number, public height: number, x?: number, y?: number) {
        if (_.isNumber(x)) {
            this.x = x;
        }
        if (_.isNumber(y)) {
            this.y = y;
        }
    }

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

    public getColor() {
        return this.color;
    }

    public setColor(color: string) {
        this.color = color;
        return this;
    }

    public getVelocity(dimension: AxisDimension) {
        switch (dimension) {
            case AxisDimension.X:
                return this.xVel;
            case AxisDimension.Y:
                return this.yVel;
            case AxisDimension.XY:
                return {
                    x: this.xVel,
                    y: this.yVel
                };
            default:
                throw new Error("Unsupported axis dimension");
        }
    }

    public setVelocity(dimension: AxisDimension, value: number) {
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

    public adjustVelocity(dimension: AxisDimension, value: number) {
        const velocity = this.getVelocity(dimension);
        if (_.isNumber(velocity)) {
            this.setVelocity(dimension, (velocity as number) + value);
            return;
        }
        this.setVelocity(AxisDimension.X, velocity.x + value);
        this.setVelocity(AxisDimension.Y, velocity.y + value);
    }

    public setWeight(weight: number) {
        this.weight = weight;
        return this;
    }

    public update() {
        this.x += this.xVel;
        this.y += this.yVel;
    }

}