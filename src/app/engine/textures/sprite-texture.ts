import * as _ from "lodash";

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

    public renderContext: CanvasRenderingContext2D;
    public currentFrame: IFrame;
    public defaultFrame: IFrame;

    public frames: IFrame[] = [];
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
        // TODO: Investigate why this isn't working
        // if (_.isArray(this.frames)) {
        //     const overlappingFrame = _.chain(this.frames)
        //         .find(existingFrame => {
        //             return !(((newFrame.y + newFrame.height) < (existingFrame.y)) ||
        //             (newFrame.y > (existingFrame.y + existingFrame.height)) ||
        //             ((newFrame.x + newFrame.width) < existingFrame.x) ||
        //             (newFrame.x > (existingFrame.x + existingFrame.width)));
        //         })
        //         .value();
        //     if (overlappingFrame) {
        //         throw new Error(`A frame with the key ${overlappingFrame.key} already exists in this position. ${JSON.stringify(overlappingFrame)}`);
        //     }
        // }
        this.frames.push(newFrame);
    }

    public getFrame(key: string) {
        return _.find(this.frames, x => x.key === key);
    }

    public setDefaultFrame(key: string) {
        if (this.defaultFrame && this.defaultFrame.key === key) {
            return;
        }
        this.defaultFrame = this.getFrame(key);
    }

    public playAnimation(key: string) {
        this.animationManager.play(key);
    }

    public stopAnimation(): void {
        this.animationManager.stop();
    }

    public addAnimation(key: string, frameSequence: string[], repeat?: boolean): void {
        this.animationManager.add(key, frameSequence, repeat);
    }

    public updateAnimation(key: string, frameSequence: string[], repeat?: boolean): void {
        this.animationManager.update(key, frameSequence, repeat);
    }

    public hasAnimation(key: string): boolean {
        return this.animationManager.has(key);
    }

    public removeAnimation(key: string): void {
        this.animationManager.remove(key);
    }

    public triggerAnimationTick(): void {
        this.animationManager.tick();
        this.currentFrame = this.animationManager.activeAnimation ? this.animationManager.activeAnimation.currentFrame : undefined;
    }

}

export class AnimationManager {

    public activeAnimation: Animation;

    private animations: Animation[] = [];

    constructor(private readonly spriteSheet: SpriteSheet) { }

    public add(key: string, sequence: string[], repeat: boolean = false): void {
        const animation = _.find(this.animations, x => x.key === key);
        if (animation) {
            return;
        }
        this.animations.push(new Animation(key, _.map(sequence, x => this.spriteSheet.getFrame(x)), repeat));
    }

    public update(key: string, sequence: string[], repeat?: boolean): void {
        const animation = _.find(this.animations, x => x.key === key);
        if (!animation) {
            throw new Error(`An animation with the key '${key}' cannot be found.`);
        }
        animation.frames = _.map(sequence, x => this.spriteSheet.getFrame(x));
        if (_.isBoolean(repeat)) {
            animation.repeat = repeat;
        }
    }

    public remove(key: string): void {
        const index = _.findIndex(this.animations, x => x.key === key);
        if (index === -1) {
            throw new Error(`An animation with the key '${key}' cannot be found.`);
        }
        this.animations.splice(index, 1);
    }

    public play(key: string): void {
        const newAnimation = this.find(key);
        if (!newAnimation) {
            throw new Error(`Cannot find an animation named '${key}'`);
        }
        if (this.activeAnimation) {
            this.activeAnimation.stop();
        }
        this.activeAnimation = newAnimation;
        newAnimation.play();
    }

    public stop(): void {
        if (this.activeAnimation) {
            this.activeAnimation.stop();
        }
        this.activeAnimation = undefined;
    }

    public tick(): void {
        if (!this.activeAnimation) {
            return;
        }
        this.activeAnimation.tick();
    }

    public find(key: string): Animation {
        return _.find(this.animations, x => x.key === key);
    }

    public has(key: string): boolean {
        return this.find(key) instanceof Animation;
    }
    
}

export class Animation {      

    public currentFrameIndex: number;
    public currentFrame: IFrame;
    public shouldPlay: boolean;

    constructor(public readonly key: string, public frames: IFrame[], public repeat: boolean = false) {

    }

    public play(): void {
        this.shouldPlay = true;
    }

    public stop(): void {
        this.shouldPlay = false;
    }

    public tick(): void {
        if (this.shouldPlay === false) {
            return;
        }

        if (this.repeat && this.currentFrameIndex === this.frames.length -1) {
            this.currentFrameIndex = undefined;
        }

        if (_.isUndefined(this.currentFrameIndex)) {
            this.currentFrameIndex = 0;
        } else if (this.currentFrameIndex >= 0 && this.currentFrameIndex < this.frames.length) {
            this.currentFrameIndex++;
        }

        this.currentFrame = this.frames[this.currentFrameIndex];
    }

}