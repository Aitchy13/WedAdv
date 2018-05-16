import * as _ from "lodash";
import { IRenderable } from "../rendering/frame-renderer";

export interface IFrame {
    key: string;
    x: number;
    y: number;
    width: number;
    height: number;
}



export class SpriteSheet {

    public width: number;
    public height: number;

    private frames: IFrame[] = [];
    private animationManager: AnimationManager;

    constructor(public key: string, public image: HTMLImageElement, frames?: IFrame[]) {
        if (_.isArray(frames) && frames.length > 0) {
            frames.forEach(x => this.defineFrame(x));
        }
        this.animationManager = new AnimationManager(this);
    }

    public defineFrame(newFrame: IFrame, overwrite?: boolean) {
        if (!_.isObject(newFrame)) {
            throw new Error("No frame defined");
        }
        if (overwrite !== true && _.find(this.frames, x => x.key === newFrame.key)) {
            throw new Error(`A frame with the key ${newFrame.key} has already been defined`);
        }
        if (_.isArray(this.frames)) {
            const overlappingFrame = _.chain(this.frames)
                .find(existingFrame => {
                    return !(((newFrame.y + newFrame.height) < (existingFrame.y)) ||
                    (newFrame.y > (existingFrame.y + existingFrame.height)) ||
                    ((newFrame.x + newFrame.width) < existingFrame.x) ||
                    (newFrame.x > (existingFrame.x + existingFrame.width)));
                })
                .value();
            if (overlappingFrame) {
                throw new Error(`A frame with the key ${overlappingFrame} already exists in this position. ${JSON.stringify(overlappingFrame)}`);
            }
        }
        this.frames.push(newFrame);
    }

    public getFrame(key: string) {
        return _.find(this.frames, x => x.key === key);
    }

    public addAnimation(key: string, frameSequence: string[], duration: number) {
        this.animationManager.add(key, frameSequence);
    }

    public updateAnimation(key: string, frameSequence: string[], duration: number) {
        this.animationManager.update(key, frameSequence);
    }

    public removeAnimation(key: string) {
        this.animationManager.remove(key);
    }

}

export class AnimationManager {

    private animations: Animation[];
    private activeAnimation: Animation;

    constructor(private readonly spriteSheet: SpriteSheet) { }

    public add(key: string, sequence: string[]) {
        this.animations.push(new Animation(key, _.map(sequence, x => this.spriteSheet.getFrame(key))));
    }

    public update(key: string, sequence: string[]) {

    }

    public remove(key: string) {

    }

    public play(key: string) {
        const animation = _.find(this.animations, x => x.key === key);
        if (!animation) {
            throw new Error(`Cannot find an animation named '${key}'`);
        }
        this.activeAnimation = animation;
        animation.play();
    }

    public stop() {
        this.activeAnimation = undefined;
    }
    
}

export class Animation {

    constructor(public readonly key: string, private frames: IFrame[]) {

    }

    public play() {

    }

}