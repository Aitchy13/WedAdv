import * as _ from "lodash";

export class MathsUtility {

    public static average(numbers: number[]) {
        return _.reduce(numbers, (x, memo) => memo += x, 0) / numbers.length;
    }

    public static degreeToRadian(degree: number) {
        return degree * Math.PI / 180;
    }

    public static randomIntegerRange(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static roundToNearestMultiple(value: number, multiple: number) {
        return Math.ceil(value / multiple) * multiple; 
    }

}