export interface IMap<T> {
    [key: string]: T;
}

export declare const Type: FunctionConstructor;
export interface Type<T> extends Function {
    new (...args: any[]): T;
}

export interface ICoordinate {
    x: number;
    y: number;
}