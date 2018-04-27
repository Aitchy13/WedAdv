import * as _ from "lodash";

import { Shape } from "../game-objects/shape";
import { IDetector } from "./detector.interface";
import { Vector } from "../game-objects/vector";

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

    private collidableObjects: ICollidable[];

    constructor(
        private detectingObject: ICollidable,
        collidableObjects: ICollidable|ICollidable[],
        private onCollision?: (collision: ICollision<T>) => void
    ) {
        this.collidableObjects = _.isArray(collidableObjects) ? collidableObjects : [collidableObjects];
    }

    public detect(): ICollidable[] {
        const collidedObjects: ICollidable[] = [];
        this.detectingObject.vertices.forEach(leftVector => {
            this.collidableObjects.forEach(obj => {
                obj.vertices.forEach((currentVector, i) => {
                    const nextVector = i === obj.vertices.length ? obj.vertices[0] : obj.vertices[i + 1];
                    const vertex: [Vector, Vector] = [currentVector, nextVector];
                    if (this.hasCollision(leftVector, vertex) && _.isFunction(this.onCollision)) {
                        this.onCollision({
                            detectingObject: this.detectingObject,
                            collidedObject: obj,
                            collisionPoint: leftVector,
                            collisionVertex: vertex
                        });
                    }
                    this.collidableObjects.push(obj);
                });
            })
        });
        return collidedObjects;
    }

    private hasCollision(testedVector: Vector, nextVertex: [Vector, Vector]) {
        if (!nextVertex[0] || !nextVertex[1]) return;
        const vc = nextVertex[0];
        const vn = nextVertex[1];
        const px = testedVector.x;
        const py = testedVector.y;
        return ((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) && (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x);
    }

}