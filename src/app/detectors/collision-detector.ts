import * as _ from "lodash";

import { Rectangle } from "../game-objects/rectangle";
import { IDetector } from "./detector.interface";

export class CollisionDetector implements IDetector {

    private otherObjects: Rectangle[];

    constructor(
        private primaryObject: Rectangle,
        otherObjects: Rectangle|Rectangle[],
        private callback: (x?: Rectangle, y?: Rectangle) => void
    ) {
        this.otherObjects = _.isArray(otherObjects) ? otherObjects : [otherObjects];
    }

    public detect() {
        this.otherObjects.forEach(otherObj => {
            if (
                !(((this.primaryObject.y + this.primaryObject.height) < (otherObj.y)) ||
                (this.primaryObject.y > (otherObj.y + otherObj.height)) ||
                ((this.primaryObject.x + this.primaryObject.width) < otherObj.x) ||
                (this.primaryObject.x > (otherObj.x + otherObj.width)))
            ) {
                this.callback(this.primaryObject, otherObj);
            }
        });
    }

}