import * as TWEEN from "@tweenjs/tween.js";

export interface IEasingFunc {
    (k: number): number
}

export class Easing {

    public static linear(t: number): number {
        return TWEEN.Easing.Linear.None(t);
    }

    public static easeInCubic(t: number): number {
        return TWEEN.Easing.Cubic.In(t);
    }

    public static easeOutCubic(t: number): number {
        return TWEEN.Easing.Cubic.Out(t);
    }

    public static easeInOutCubic(t: number): number {
        return TWEEN.Easing.Cubic.InOut(t);
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

    public static easeQuarticIn(t: number): number {
        return TWEEN.Easing.Quartic.In(t);
    }

    public static easeQuarticOut(t: number): number {
        return TWEEN.Easing.Quartic.Out(t);
    }

    public static easeQuarticInOut(t: number): number {
        return TWEEN.Easing.Quartic.InOut(t);
    }

}