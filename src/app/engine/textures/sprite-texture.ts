import * as _ from "lodash";
import { IRenderable } from "../rendering/frame-renderer";

export interface ISprite {
    key: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export class SpriteSheetTexture {

    public width: number;
    public height: number;

    private sprites: ISprite[] = [];

    constructor(public key: string, public image: HTMLImageElement, sprites?: ISprite[]) {
        if (_.isArray(sprites) && sprites.length > 0) {
            sprites.forEach(x => this.defineSprite(x));
        }
    }

    public defineSprite(newSprite: ISprite, overwrite?: boolean) {
        if (!_.isObject(newSprite)) {
            throw new Error("No sprite defined");
        }
        if (overwrite !== true && _.find(this.sprites, x => x.key === newSprite.key)) {
            throw new Error(`A sprite with the key ${newSprite.key} has already been defined`);
        }
        if (_.isArray(this.sprites)) {
            const overlappingSprite = _.chain(this.sprites)
                .find(existingSprite => {
                    return !(((newSprite.y + newSprite.height) < (existingSprite.y)) ||
                    (newSprite.y > (existingSprite.y + existingSprite.height)) ||
                    ((newSprite.x + newSprite.width) < existingSprite.x) ||
                    (newSprite.x > (existingSprite.x + existingSprite.width)));
                })
                .value();
            if (overlappingSprite) {
                throw new Error(`A sprite with the key ${overlappingSprite} already exists in this position. ${JSON.stringify(overlappingSprite)}`);
            }
        }
        this.sprites.push(newSprite);
    }

    public getSprite(key: string) {
        return _.find(this.sprites, x => x.key === key);
    }

}