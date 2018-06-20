import * as _ from "lodash";
import axios from "axios";

import { ImageTexture } from "./image-texture";
import { SpriteSheet, IFrame } from "./sprite-texture";
import { Logger } from "../utilities/logger";
import { Sound } from "../audio/sound";

interface IRetrievalStack {
    key: string;
    promise: Promise<HTMLImageElement>;
}

export class AssetLoader {

    private sounds: Sound[] = [];
    private images: ImageTexture[] = [];
    private spriteSheets: SpriteSheet[] = [];

    private retrievalStack: IRetrievalStack[] = [];

    constructor(private logger: Logger) {}

    public loadSound(key: string, path: string): Promise<any> {
        const existingSound = _.find(this.sounds, x => x.key === key);
        if (existingSound) {
            return Promise.resolve(existingSound);
        }
        // TODO: Add retrieval stack logic

        const sound = new Sound(key, path);
        return sound.load().then(x => {
            this.sounds.push(sound);
            return sound;
        }).catch(e => {
            this.logger.error(e);
            return Promise.reject(e);
        });
    }

    public loadImage(key: string, path: string): Promise<ImageTexture> {
        const existingImage = _.find(this.images, x => x.key === key);
        if (existingImage) {
            return Promise.resolve(existingImage);
        }
        const existingRequest = _.find(this.retrievalStack, x => x.key === key);
        const promise = existingRequest ? existingRequest.promise : this.retrieveImage(key, path);
        return promise.then(image => {
            const texture = new ImageTexture(key, image);
            this.images.push(texture);
            return texture;
        }).catch(e => {
            this.logger.error(e);
            return Promise.reject(e);
        });
    }

    public loadSpriteSheet(key: string, path: string, jsonPath: string): Promise<SpriteSheet>;
    public loadSpriteSheet(key: string, path: string, sprites: IFrame[]): Promise<SpriteSheet>;
    public loadSpriteSheet(key: string, path: string, val?: IFrame[]|string): Promise<SpriteSheet> {
        const getSprites = (x: IFrame[]| string) => {
            return new Promise<IFrame[]>((resolve, reject) => {
                if (_.isArray(x) && x.length > 0) {
                    return resolve(x);
                }
                if (_.isString(x) && x.length > 0) {
                    return this.retrieveFrames(x).then(frames => {
                        return resolve(frames);
                    });
                }
                return reject(new Error("Invalid argument specified"));
            })   
        };

        return getSprites(val).then(sprites => {
            const existingSpriteSheet = _.find(this.spriteSheets, x => x.key === key);
            if (existingSpriteSheet) {
                return Promise.resolve(existingSpriteSheet);
            }
            const existingRequest = _.find(this.retrievalStack, x => x.key === key);
            const promise = existingRequest ? existingRequest.promise : this.retrieveImage(key, path);
            return promise.then(image => {
                const texture = new SpriteSheet(key, image, sprites);
                this.spriteSheets.push(texture);
                return texture;
            });
        }).catch((e: Error) => {
            this.logger.error(e);
            return Promise.reject(e);
        });        
    }

    public getSpriteSheet(key: string, returnCopy?: boolean) {
        const spriteSheet = _.find(this.spriteSheets, x => x.key === key);
        if (returnCopy && spriteSheet) {
            return new SpriteSheet(spriteSheet.key, spriteSheet.image, spriteSheet.frames);
        }
        return spriteSheet;
    }

    public getImage(key: string) {
        return _.find(this.images, x => x.key === key);
    }

    public getSound(key: string) {
        return _.find(this.sounds, x => x.key === key);
    }

    private retrieveImage(key: string, path: string): Promise<HTMLImageElement> {
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.onload = evt => {
                this.removeRequest(key);
                resolve(image);
            };
            image.onerror = e => {
                this.removeRequest(key);
                reject(e);
            };
            image.src = path;
        });
        this.retrievalStack.push({
            key: key,
            promise: promise
        });
        return promise;
    }

    private retrieveFrames(path: string) {
        return axios.get<IFrame[]>(path, {
            responseType: "json"
        }).then(response => {
            if (_.isArray(response.data) && response.data.length > 0) {
                return response.data;
            }
            throw new Error("No JSON data found");
        });
    }

    private removeRequest(key: string) {
        const index = _.findIndex(this.retrievalStack, x => x.key === key);
        this.retrievalStack.splice(index, 1);
    }

}