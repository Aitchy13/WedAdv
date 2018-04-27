import * as _ from "lodash";

export class Maths {

    public static average(numbers: number[]) {
        return _.reduce(numbers, (x, memo) => memo += x, 0) / numbers.length;
    }

    public static degreeToRadian(degree: number) {
        return degree * Math.PI / 180;
    }

}