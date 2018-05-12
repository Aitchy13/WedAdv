import { Tween } from "./tween";
import { IMoveable } from "../physics/moveable";
import { Vector } from "../core/vector";
import { Rectangle } from "../game-objects/rectangle";

describe("Tween", () => {

    let tween: Tween;
    let moveable: IMoveable;

    beforeEach(() => {
        moveable  = new Rectangle(10, 10, 10, 10);
        tween = new Tween(moveable);
    });

    it ("must do something", () => {

    });

});