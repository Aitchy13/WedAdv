import * as _ from "lodash";

import { IMap } from "../../core/core.models";
import { AssetLoader } from "../../textures/asset-loader";
import { SpriteSheet } from "../../textures/sprite-texture";
import { BitmapCharacter } from "./bitmap-character";

export class BitmapFont {

    private loaded: boolean = false;
    private size: number;
    private characterMap: IMap<BitmapCharacter> = {};
    private sprite: SpriteSheet;

    constructor(public readonly key: string, private assetLoader: AssetLoader) {

    }

    public load(path: string, jsonPath: string): Promise<SpriteSheet> {
        return this.assetLoader.loadSpriteSheet(this.key, path, jsonPath).then((spriteSheet) => {
            this.loaded = true;
            this.sprite = spriteSheet;
            this.setSingleCharacterSpriteKeys(spriteSheet);
            return spriteSheet;
        });
    }

    public setCharacter(character: string, frameKey: string): void {
        this.checkFontLoaded();

        const frame = _.find(this.sprite.frames, x => x.key === frameKey);
        if (!frame) {
            throw new Error(`No frame with the key ${frameKey} could be found`);
        }
        this.size = frame.height;

        this.characterMap[character] = new BitmapCharacter(character, frame.width, frame.height, this.sprite.image, frame);
    }

    public getCharacter(key: string): BitmapCharacter {
        this.checkFontLoaded();
        const character = this.characterMap[key];
        if (!character) {
            throw new Error(`Character with key of '${key}' not found`);
        }
        return character;
    }
    
    public listCharacters(): string[] {
        this.checkFontLoaded();
        return _.chain(this.characterMap)
            .keys()
            .map(x => x.toString())
            .value();
    }

    public getSize(): number {
        this.checkFontLoaded();
        return this.size;
    }

    private checkFontLoaded() {
        if (!this.loaded) {
            throw new Error("Font has not been loaded");
        }
    }

    private setSingleCharacterSpriteKeys(spriteSheet: SpriteSheet) {
        _.chain(spriteSheet.frames)
            .map(x => x.key)
            .filter(x => x.length === 1)
            .each(x => this.setCharacter(x, x))
            .value();
    }

}