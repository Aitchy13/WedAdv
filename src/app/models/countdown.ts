import * as _ from "lodash";

import { BitmapFont } from "../engine/ui/font/bitmap-font";
import { AssetLoader } from "../engine/textures/asset-loader";
import { IRenderable } from "../engine/rendering/renderer";
import { BitmapCharacter } from "../engine/ui/font/bitmap-character";
import { Rectangle } from "../engine/game-objects/rectangle";

export type CountdownEventName = "start" | "stop" | "tick";

export interface ICountdownFontOverride {
    key: string;
    path: string;
    jsonPath: string;
}

export class Countdown implements IRenderable {

    public timeRemaining: number = 0;
    public startTime: number;

    private intervalId: any;
    private font: BitmapFont;
    private formattedTime: BitmapCharacter[];
    private hourglass: Rectangle;

    private eventHandlers: {
        "start": Function[]
        "stop": Function[]
        "tick": Function[]
    };


    constructor(public x: number, public y: number, private currentTime: number, private assetLoader: AssetLoader, private fontOverride?: ICountdownFontOverride) {
        this.eventHandlers = {
            "start": [],
            "stop": [],
            "tick": []
        };
        this.startTime = this.currentTime;
    }

    public load() {
        this.font = new BitmapFont(this.fontOverride ? this.fontOverride.key : "countdown", this.assetLoader);
        return this.font.load(this.fontOverride ? this.fontOverride.path : "src/sprites/countdown.png", this.fontOverride ? this.fontOverride.jsonPath : "src/sprites/countdown.json").then((sprite) => {
            this.hourglass = new Rectangle(35, 45, this.x, this.y);
            this.hourglass.spriteSheet = sprite;
        })
    }

    public start() {
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
        this.triggerEventHandlers("start");
    }

    public setSeconds(secs: number) {
        this.currentTime = secs;
    }

    public add(secs: number) {
        this.currentTime += Math.floor(secs);
    }

    public subtract(secs: number) {
        this.currentTime -= Math.floor(secs);
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.triggerEventHandlers("stop");
        }
    }

    public on(eventName: CountdownEventName, handler: Function) {
        this.eventHandlers[eventName].push(handler);
    }

    public tick() {
        this.currentTime--;
        if (this.currentTime === 0) {
            this.stop();
            return;
        }
        this.onTickEnd();
        this.triggerEventHandlers("tick");
    }

    public getFormatted(): string {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime - minutes * 60;
        const zeroedSeconds = seconds < 10 ? `${0}${seconds}` : seconds;
        return `${minutes}:${zeroedSeconds}`;
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        if (!this.formattedTime) {
            return;
        }
        this.formattedTime.forEach(x => x.render(ctx));
        this.hourglass.render(ctx, timeDelta);
    }

    private onTickEnd() {
        const timeAsString = this.getFormatted();
        this.formattedTime = _.chain(timeAsString)
            .map(x => this.font.getCharacter(x))
            .each((char, i) => {
                char.x = this.hourglass.x + 20 + ((i + 1) * char.width);
                char.y = this.y;
            })
            .value();
        const percentageRemaining = (this.startTime / this.currentTime) * 100;
        if (percentageRemaining > 66) {
            this.hourglass.spriteSheet.currentFrame = this.hourglass.spriteSheet.getFrame("timer-start");
        } else if (percentageRemaining > 20) {
            this.hourglass.spriteSheet.currentFrame = this.hourglass.spriteSheet.getFrame("timer-mid");
        } else {
            this.hourglass.spriteSheet.currentFrame = this.hourglass.spriteSheet.getFrame("timer-end");
        }
    }

    private triggerEventHandlers(eventName: CountdownEventName) {
        if (this.eventHandlers[eventName].length === 0) {
            return;
        }
        for (const handler of this.eventHandlers[eventName]) {
            handler();
        }
    }

}