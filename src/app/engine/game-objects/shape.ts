import * as _ from "lodash";
import { Vector } from "../core/vector";
import { Time } from "../utilities/time";
import { Moveable, PositionStrategy, IMoveable, AxisDimension } from "../physics/moveable";
import { Tween } from "../animation/tween";
import { IEasingFunc } from "../animation/easing";

interface IShape extends IMoveable { }

@Moveable()
export class Shape implements IShape {

    public degree: number = 0;
    public degreeVel: number = 0;

    public mass: number = 1000;

    private color: string = "#000";

    // Applied by @Moveable decorator
    public xVel: number = 0;
    public yVel: number = 0;
    public origin: Vector;
    public move: (x: number, y: number, positionStrategy: PositionStrategy) => void;
    public movePath: (path: Vector[], speed?: number, easing?: IEasingFunc, onComplete?: Function) => void;
    public getVelocity: () => { x: number, y: number };
    public setVelocity: (dimension: AxisDimension, value: number) => this;
    public adjustVelocity: (dimension: AxisDimension, value: number) => this;

    constructor(private x: number, private y: number, public vertices: Vector[]) {
        this.origin = new Vector(x, y);
        this.move(x, y, PositionStrategy.Absolute);
    }

    public getPosition() {
        return {
            x: this.x,
            y: this.y
        };
    }

    public getColor() {
        return this.color;
    }

    public setColor(color: string) {
        this.color = color;
        return this;
    }

    public rotate(degree: number) {
        this.degree = degree;
        this.vertices.forEach(vector => Vector.rotate(this.origin, vector, degree));
        return this;
    }

    public setMass(mass: number) {
        this.mass = mass;
        return this;
    }

    public render(context: CanvasRenderingContext2D, time: Time) {
        this.move(this.xVel * time.delta, this.yVel * time.delta, PositionStrategy.Relative);
        this.rotate((this.degree + this.degreeVel) * time.delta);

        context.beginPath();
        context.moveTo(this.origin.x, this.origin.y);
        this.vertices.forEach(vector => context.lineTo(vector.x, vector.y));
        context.fillStyle = this.color;
        context.closePath();
        context.fill();
    }

}