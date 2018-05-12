import { Vector } from "./vector";

describe("Vector", () => {
    
    let vector: Vector;

    beforeEach(() => {
        vector = new Vector(5, 50);
    });

    it("must create a new vector", () => {
        expect(vector instanceof Vector).toBe(true);
    });

    it("must add two vectors, returning a new vector", () => {
        const result = vector.add(new Vector(20, 30));
        expect([result.x, result.y]).toEqual([25, 80]);
        expect(vector !== result).toBe(true);
        expect(result instanceof Vector).toBe(true);
    });

    it("must add and merge two vectors, returning the merged vector", () => {
        const result = vector.addMerge(new Vector(20, 30));
        expect([result.x, result.y]).toEqual([25, 80]);
        expect(vector === result).toBe(true);
        expect(result instanceof Vector).toBe(true);
    });

    it("must subtract two vectors, returning a new vector", () => {
        const result = vector.subtract(new Vector(10, 30));
        expect([result.x, result.y]).toEqual([-5, 20]);
        expect(vector !== result).toBe(true);
        expect(result instanceof Vector).toBe(true);
    });

    it("must subtract and merge two vectors, returning the merged vector", () => {
        const result = vector.subtractMerge(new Vector(10, 30));
        expect([result.x, result.y]).toEqual([-5, 20]);
        expect(vector === result).toBe(true);
        expect(result instanceof Vector).toBe(true);
    });
    
    it("must multiple itself with a scalar, returning a new vector", () => {
        const result = vector.multiply(5);
        expect([result.x, result.y]).toEqual([25, 250]);
        expect(vector !== result).toBe(true);
        expect(result instanceof Vector).toBe(true);
    });

    it("must multiple itself with a scalar, returning itself", () => {
        const result = vector.multiplyBy(5);
        expect([result.x, result.y]).toEqual([25, 250]);
        expect(vector === result).toBe(true);
        expect(result instanceof Vector).toBe(true);
    });

    it("must return the minimum x or y value", () => {
        expect(vector.min()).toBe(5);
    });

    it("must return the maximum x or y value", () => {
        expect(vector.max()).toBe(50);
    });

    it("must return a new copy of itself", () => {
        const vectorCopy = vector.copy();
        expect([vectorCopy.x, vectorCopy.y]).toEqual([5, 50]);
        expect(vectorCopy !== vector).toBe(true);
        expect(vectorCopy instanceof Vector).toBe(true);
    });

    it("must return a string representation of its x and y values", () => {
        expect(vector.toString()).toBe(`x: ${vector.x}, y: ${vector.y}`);
    });

    it("must return an array representation of its x and y values", () => {
        expect(vector.toArray()).toEqual([5, 50]);
    });

    it("must return an object representation of its x and y values", () => {
        expect(vector.toObject()).toEqual({
            x: 5,
            y: 50
        });
    });

});