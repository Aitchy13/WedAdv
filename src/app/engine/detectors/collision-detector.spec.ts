import { CollisionDetector, ICollidable } from "./collision-detector";
import { Vector } from "../core/vector";

describe("Collision detector", () => {

    let detector: CollisionDetector<ICollidable>;
    let shapeA: ICollidable;

    beforeEach(() => {
        shapeA = {
            vertices: [
                new Vector(4, 4),
                new Vector(5, 4),
                new Vector(5, 5),
                new Vector(4, 5)
            ]
        };
        detector = undefined;
    });

    // it("must detect a collision given a vector that collides with a vertice", () => {
    //     let point = new Vector(4.5, 4);
    //     expect(CollisionDetector.hasCollision(point, shapeA.vertices)).toBe(true);
    // });

});