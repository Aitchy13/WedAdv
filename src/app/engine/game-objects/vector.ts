import * as _ from "lodash";
import { Maths } from "../utilities/maths";

export class Vector {

    constructor(public x: number = 0, public y: number = 0) {

    }

    // public getAngle() {
    //     return Math.atan2(this.x, this.y);
    // }

    // public setAngle(angle: number) {
    //     const length = this.getLength();
    //     this.x = Math.cos(angle) * length;
    //     this.y = Math.cos(angle) * length;
    //     return this;
    // }

    // public getLength() {
    //     return Math.sqrt((this.x * this.x) + (this.y * this.y));
    // }

    // public setLength(length: number) {
    //     const direction = this.getAngle();
    //     this.x = Math.cos(direction) * length;
    //     this.y = Math.sin(direction) * length;
    //     return this;
    // }

    public add(vector: Vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    public addMerge(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    public subtract(vector: Vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    public subtractMerge(vector: Vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    public multiply(scalar: number) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    public multiplyBy(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    public min() {
        return Math.min(this.x, this.y);
    }

    public max() {
        return Math.max(this.x, this.y);
    }

    public copy() {
        return new Vector(this.x, this.y);
    }

    public toString() {
        return `x: ${this.x}, y: ${this.y}`;
    }

    public toArray() {
        return [this.x, this.y];
    }

    public toObject() {
        return {
            x: this.x,
            y: this.y
        };
    }

    public static rotate(origin: Vector, point: Vector, angle: number) {
        const radian = Maths.degreeToRadian(angle);
        const x = (Math.cos(radian) * (point.x - origin.x) -
                     (Math.sin(radian) * (point.y - origin.y)) +
                     origin.x);
        const y = (Math.sin(radian) * (point.x - origin.x) +
                     (Math.cos(radian) * (point.y - origin.y)) +
                     origin.y);
        point.x = x;
        point.y = y;
        return point;
    }

}