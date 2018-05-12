import * as _ from "lodash";

import { Shape } from "../game-objects/shape";
import { IDetector } from "./detector.interface";
import { Vector } from "../core/vector";
import { Rectangle } from "../game-objects/rectangle";

export interface ICollidable {
    vertices: Vector[];
}

export interface ICollision<T> {
    detectingObject: T & ICollidable;
    collidedObject: any & ICollidable;
    collisionPoint: Vector;
    collisionVertex: [Vector, Vector];
}

export class CollisionDetector<T> implements IDetector {

    private collidableObject: ICollidable;

    constructor(
        private detectingObject: ICollidable,
        collidableObject: ICollidable
    ) {
        this.collidableObject = collidableObject;
    }

    public detect(onCollision?: (collision: ICollision<T>) => void): ICollidable {

        let collidedObject: ICollidable;

        this.detectingObject.vertices.forEach(detectingVector => {
            if (collidedObject) {
                return;
            }
            if (CollisionDetector.hasCollision(detectingVector, this.collidableObject.vertices)) {
                collidedObject = this.collidableObject;
                if (_.isFunction(onCollision)) {
                    onCollision({
                        detectingObject: this.detectingObject,
                        collidedObject: this.collidableObject
                    });
                }
            }
        });

        return collidedObject;
    }

    public static hasCollision(vector: Vector, vertices: Vector[]) {
        const px = vector.x;
        const py = vector.y;

        let collision = false;
        let next: number = 0;
        for (let current = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next === vertices.length) {
                next = 0;
            }
            const vc = vertices[current];
            const vn = vertices[next];

            if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) && (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
                collision = !collision;
            }
        }
        return collision;
    }

    public static rectangleHasCollision(rect1: Rectangle, rect2: Rectangle) {
        return rect1.origin.x < rect2.origin.x + rect2.width &&
        rect1.origin.x + rect1.width > rect2.origin.x &&
        rect1.origin.y < rect2.origin.y + rect2.height &&
        rect1.height + rect1.origin.y > rect2.origin.y
    }

}