import * as _ from "lodash";

export class Validation {

    public static isTrue(condition: boolean, message?: string) {
        if (!condition) {
            if (message) {
                throw new Error(message);
            }
            throw new Error("Validation failed");
        }
    }

    public static isNotEmptyString(val: any, message?: string) {
        Validation.isTrue(_.isString(val) && val.length > 0, message);
    }

    public static isNotEmptyArray(val: any, message?: string) {
        Validation.isTrue(_.isArray(val) && val.length > 0, message);
    }

}