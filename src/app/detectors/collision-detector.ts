import * as _ from "lodash";

import { Rectangle } from "../game-objects/rectangle";
import { IDetector } from "./detector.interface";

export class CollisionDetector implements IDetector {

    private collidableObjects: Rectangle[];

    constructor(
        private detectingObject: Rectangle,
        collidableObjects: Rectangle|Rectangle[],
        private onCollision?: (x?: Rectangle, y?: Rectangle) => void
    ) {
        this.collidableObjects = _.isArray(collidableObjects) ? collidableObjects : [collidableObjects];
    }

    public detect(): Rectangle[] {
        const collidedObjects: Rectangle[] = [];
        this.collidableObjects.forEach(otherObj => {
            if (
                !(((this.detectingObject.y + this.detectingObject.height) < (otherObj.y)) ||
                (this.detectingObject.y > (otherObj.y + otherObj.height)) ||
                ((this.detectingObject.x + this.detectingObject.width) < otherObj.x) ||
                (this.detectingObject.x > (otherObj.x + otherObj.width)))
            ) {
                if (_.isFunction(this.onCollision)) {
                    collidedObjects.push(otherObj);
                    this.onCollision(this.detectingObject, otherObj);
                }
            }
        });
        return collidedObjects;
    }

}