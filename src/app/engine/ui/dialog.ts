import * as _ from "lodash";

import { Renderer, IRenderable } from "../rendering/renderer";
import { SpriteSheet } from "../textures/sprite-texture";
import { Rectangle } from "../game-objects/rectangle";
import { AssetLoader } from "../textures/asset-loader";
import { KeyboardInput, KeyboardInputEvent } from "../input/keyboard-input";
import { Tween } from "../animation/tween";
import { Vector } from "../core/vector";
import { Easing } from "../animation/easing";
import { PositionStrategy } from "../physics/moveable";
import { Sound } from "../audio/sound";
import { Canvas } from "../core/canvas";

export interface ICanTalk {
    name: string;
    dialogSpriteSheet: SpriteSheet;
    startTalking(): void;
    stopTalking(): void;
}

export type DialogEventName = "show" | "close";

export class DialogService {

    private activeDialog: Dialog;

    constructor(private keyboardInput: KeyboardInput, private renderer: Renderer, private canvas: Canvas, private assetLoader: AssetLoader) {
        
    }

    public show(text: string, character?: ICanTalk) {
        return new Promise((resolve, reject) => {
            if (this.activeDialog) {
                this.activeDialog.close();
            }
            const dialog = new Dialog(this.renderer, this.canvas, this.assetLoader, this.keyboardInput);
            if (character) {
                dialog.setAvatar(character);
            }
            dialog.setText(text);
            dialog.on("close", () => {
                resolve();
            });
            this.activeDialog = dialog;
            this.activeDialog.show();
        });
    }

}

export class DialogArrow implements IRenderable {

    public shape: Rectangle;

    public tween: Tween;

    private originalX: number;
    private originalY: number;
    private animationSpeed: number = 500;

    constructor(public x: number, public y: number, public assetLoader: AssetLoader) {
        this.originalX = x;
        this.originalY = y;
        this.shape = new Rectangle(11, 8, x, y);
        this.shape.imageTexture = this.assetLoader.getImage("dialog-arrow");
        this.initialiseTween();
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        this.shape.x = this.x;
        this.shape.y = this.y;
        this.shape.render(ctx, timeDelta, PositionStrategy.Absolute);
    }

    public play() {
        this.tween.start();
        return this;
    }

    public stop() {
        this.tween.stop();
        return this;
    }

    public reset() {
        this.tween.stop();
        this.x = this.originalX;
        this.y = this.originalY;
        this.initialiseTween();
        return this;
    }

    private initialiseTween() {
        this.tween = new Tween(this)
            .to(new Vector(this.x, this.y - 10), this.animationSpeed, Easing.easeInOutQuad)
            .yoyo()
            .repeat();
    }

}

export class DialogAvatar implements IRenderable, ICanTalk {

    public dialogSpriteSheet: SpriteSheet;
    public shape: Rectangle;

    constructor(public name: string, public x: number, public y: number, public width: number, public height: number) {
        this.shape = new Rectangle(width, height, x, y);
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        this.shape.render(ctx, timeDelta);
    }

    public startTalking() {

    }

    public stopTalking() {
        
    }

}

export class Dialog implements IRenderable {

    public x: number;
    public y: number;

    private width: number = 470;
    private height: number = 104;
    private shape: Rectangle;
    private avatar: DialogAvatar;

    private maxLines: number = 2;

    private textFontSize: number = 16;
    private textFontWeight: string = "bold";
    private textFontFamily: string = "Arial";
    private textFont: string = `${this.textFontWeight} ${this.textFontSize}px ${this.textFontFamily}`;
    private textX: number;
    private textY: number;
    private textSnippets: string[][];
    private textColor: string = "#fff";

    private currentSnippetIndex: number = -1;
    private activeTextSnippet: string[];

    private animatingTextInterval: number;
    private continueArrow: DialogArrow;

    private openSound: Sound;
    private continueSound: Sound;
    private closeSound: Sound;

    private boundKeyupHandler: (evt: KeyboardInputEvent) => void;

    private visible: boolean = false;

    private eventHandlers: {
        "show": Function[];
        "close": Function[];
    };

     constructor(private renderer: Renderer, private canvas: Canvas, private assetLoader: AssetLoader, private keyboardInput: KeyboardInput) {
        this.shape = new Rectangle(this.width, this.height, (this.canvas.width / 2) - this.width / 2, this.canvas.height - this.height - 20);
        this.shape.imageTexture = this.assetLoader.getImage("dialog");
        this.x = this.shape.vertices[0].x;
        this.y = this.shape.vertices[0].y;

        this.eventHandlers = {
            "show": [],
            "close": []
        };

        this.openSound = this.assetLoader.getSound("menu-open");
        this.openSound.load();

        this.continueSound = this.assetLoader.getSound("mouseclick");
        this.continueSound.load();

        this.closeSound = this.assetLoader.getSound("menu-close");
        this.closeSound.load();
        

        // this.textX calculated when setting text
        this.textY = this.y + 50;

        this.continueArrow = new DialogArrow(this.x + (this.width / 2), this.y + this.height - 15, this.assetLoader);
    }

    public setText(text: string) {
        const maxWidth = this.avatar ? 325 : 425;
        this.textX = this.x + ( this.avatar ? 116 : 30);
        this.textSnippets = this.createTextSnippets(text, maxWidth);
        return this;
    }

    public setAvatar(character: ICanTalk) {
        this.avatar = new DialogAvatar(character.name, this.x + 10, this.y + 10, 100, 100);
        this.avatar.dialogSpriteSheet = character.dialogSpriteSheet;
        this.avatar.shape.spriteSheet = character.dialogSpriteSheet;
        this.avatar.startTalking = () => {
            character.startTalking();
        };
        this.avatar.stopTalking = () => {
            character.stopTalking();   
        };
        return this;
    }

    public show() {
        if (this.visible) {
            return this;
        }
        this.visible = true;
        this.renderer.addObject(this);
        this.cycleSnippet();
        this.bindKeyboardEvents();
        this.openSound.play();
        if (this.avatar) {
            this.avatar.startTalking();
        }
        this.triggerEventHandlers("show");
        return this;
    }
    
    public close() {
        if (!this.visible) {
            return this;
        }
        this.visible = false;
        this.renderer.removeObject(this); 
        this.unbindKeyboardEvents();
        if (this.avatar) {
            this.avatar.stopTalking();
        }
        this.closeSound.play();
        this.triggerEventHandlers("close");
        return this;
    }

    public on(eventName: DialogEventName, callback: Function) {
        this.eventHandlers[eventName].push(callback);
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        this.shape.render(ctx, timeDelta);
        ctx.font = this.textFont;
        ctx.fillStyle = this.textColor;

        if (this.textSnippets) {
            this.renderTextSnippet(this.activeTextSnippet);
        }
        if (this.avatar) {
            ctx.font = "bold 12px arial";
            ctx.fillStyle = "#efd960";
            ctx.fillText(this.avatar.name.toUpperCase(), this.textX, this.textY - 25);
            this.avatar.render(ctx, timeDelta);
        }
    }

    private cycleSnippet() {
        this.renderer.removeObject(this.continueArrow.reset());
        if (this.currentSnippetIndex + 1 < this.textSnippets.length) {
            this.currentSnippetIndex++;
            if (this.currentSnippetIndex > 0) {
                this.continueSound.play();
            }
            this.activeTextSnippet = this.textSnippets[this.currentSnippetIndex];
            this.stopLetterAnimation();
            this.avatar.startTalking();
            this.startLetterAnimation(this.activeTextSnippet, () => {
                this.avatar.stopTalking();
                if (this.currentSnippetIndex < this.textSnippets.length - 1) {
                    this.renderer.addObject(this.continueArrow.play());
                }
            });
        } else {
            this.close();
        }
    }

    private triggerEventHandlers(eventName: DialogEventName) {
        if (this.eventHandlers[eventName].length === 0) {
            return;
        }
        for (const handler of this.eventHandlers[eventName]) {
            handler();
        }
    }

    private bindKeyboardEvents() {
        this.boundKeyupHandler = (evt: KeyboardInputEvent) => {
            if (evt.event.key === "Enter" || evt.event.code === "Space") {
                this.cycleSnippet();
            }
        }
        this.boundKeyupHandler.bind(this);
        this.keyboardInput.on("keyup", this.boundKeyupHandler);
    }

    private unbindKeyboardEvents() {
        this.keyboardInput.unbind("keyup", this.boundKeyupHandler);
    }

    private createTextSnippets(text: string, maxWidth: number): string[][] {
        const transformedText = text.toUpperCase();
        const words = transformedText.split(" ");

        let line = "";
        const lines: string[] = [];
        for(let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            const testLine = line + words[wordIndex] + " ";
            this.renderer.context.font = this.textFont;
            const metrics = this.renderer.context.measureText(testLine);
            if (wordIndex + 1 === words.length) {
                lines.push(testLine);
                break;
            }
            if ((metrics.width > maxWidth && wordIndex > 0)) {
                lines.push(line);
                line = words[wordIndex] + " ";
            } else {
                line = testLine;
            }
        }

        let splitIntoMaxLines = _.chunk(lines, this.maxLines);

        return splitIntoMaxLines;
    }

    private startLetterAnimation(textSnippet: string[], callback?: Function) {
        const snippetCopy = _.map(textSnippet, x => x.slice());
        let lineNum = 0;
        let characterPosition = 0;
        this.activeTextSnippet = _.map(this.activeTextSnippet, x => "");
        this.animatingTextInterval = setInterval(() => {
            this.activeTextSnippet[lineNum] += snippetCopy[lineNum][characterPosition];
            if (this.activeTextSnippet[lineNum].length < snippetCopy[lineNum].length) {
                characterPosition++;
                return;
            }
            if (_.isString(this.activeTextSnippet[lineNum + 1]) && this.activeTextSnippet[lineNum + 1].length === 0) {
                lineNum++;
                characterPosition = 0;
                return;
            }
            clearInterval(this.animatingTextInterval);
            if (callback) {
                callback();
            }
        }, 50);
    }

    private stopLetterAnimation() {
        if (this.animatingTextInterval) {
            clearInterval(this.animatingTextInterval);
        }
    }

    private renderTextSnippet(textSnippet: string[]) {
        if (!textSnippet) {
            return;
        }
        for (let i = 0; i < textSnippet.length; i++) {
            const line = textSnippet[i];
            this.renderer.context.fillText(line, this.textX, this.textY + (i * (this.textFontSize * 1.4)));
        }
    }

}