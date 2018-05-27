import { Rectangle } from "./rectangle";
import { PositionStrategy } from "../physics/moveable";

describe("Rectangle game object", () => {

    let rectangle: Rectangle;

    beforeEach(() => {
        rectangle = new Rectangle(10, 20, 100, 100);
    });

    it("must set the default origin as the starting x and y values", () => {
        expect([rectangle.x, rectangle.y]).toEqual([100, 100]);
    });

    it("must set 4 correct vertices when instantiated", () => {
        expect([rectangle.vertices[0].x, rectangle.vertices[0].y]).toEqual([100, 100]);
        expect([rectangle.vertices[1].x, rectangle.vertices[1].y]).toEqual([110, 100]);
        expect([rectangle.vertices[2].x, rectangle.vertices[2].y]).toEqual([110, 120]);
        expect([rectangle.vertices[3].x, rectangle.vertices[3].y]).toEqual([100, 120]);
    });

    it("must keep the same proportions when moved relatively", () => {
        rectangle.move(100, 100, PositionStrategy.Relative);
        expect([rectangle.vertices[0].x, rectangle.vertices[0].y]).toEqual([200, 200]);
        expect([rectangle.vertices[1].x, rectangle.vertices[1].y]).toEqual([210, 200]);
        expect([rectangle.vertices[2].x, rectangle.vertices[2].y]).toEqual([210, 220]);
        expect([rectangle.vertices[3].x, rectangle.vertices[3].y]).toEqual([200, 220]);
    });

});