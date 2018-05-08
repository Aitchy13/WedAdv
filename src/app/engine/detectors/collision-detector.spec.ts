import { CollisionDetector, ICollidable } from "./collision-detector";
import { Vector } from "../game-objects/vector";

describe("Collision detector", () => {

    let detector: CollisionDetector<ICollidable>;
    let shapeA: ICollidable;
    let shapeB: ICollidable;

    beforeEach(() => {
        shapeA = {
            vertices: [
                new Vector(4, 4),
                new Vector(5, 4),
                new Vector(5, 5),
                new Vector(4, 5)
            ]
        };;
        shapeB = undefined;
        detector = undefined;
    });

});