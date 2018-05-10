import * as TWEEN from "@tweenjs/tween.js";

export class Easing {

    public static linear(t: number): number {
        return TWEEN.Easing.Linear.None(t);
    }

    public static easeInQuad(t: number): number {
        return TWEEN.Easing.Quadratic.In(t);
    }

    public static easeOutQuad(t: number): number {
        return TWEEN.Easing.Quadratic.Out(t);
    }

    public static easeInOutQuad(t: number): number {
        return TWEEN.Easing.Quadratic.InOut(t);
    }

}