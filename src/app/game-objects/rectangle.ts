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

    public getVelocity() {
        return {
            x: this.xVel,
            y: this.yVel
        };
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
                throw new Error("Unsupported dimension specifed");
        }
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