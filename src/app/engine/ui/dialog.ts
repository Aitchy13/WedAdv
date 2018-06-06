import * as _ from "lodash";

import { Renderer, IRenderable } from "../rendering/renderer";
import { SpriteSheet } from "../textures/sprite-texture";
import { Rectangle } from "../game-objects/rectangle";
import { AssetLoader } from "../textures/asset-loader";
import { KeyboardInput, KeyboardInputEvent } from "../input/keyboard-input";

export interface ICanTalk {
    name: string;
    dialogSpriteSheet: SpriteSheet;
    startTalking(): void;
    stopTalking(): void;
}

export type DialogEventName = "start" | "complete";

export class DialogService {

    private eventHandlers: {
        "start": Function[];
        "complete": Function[];
    };

    private activeDialog: Dialog;

    constructor(private keyboardInput: KeyboardInput, private renderer: Renderer, private window: Window, private assetLoader: AssetLoader) {
        
    }

    public show(text: string, character?: ICanTalk) {
        if (this.activeDialog) {
            this.activeDialog.hide();
        }
        const dialog = new Dialog(this.renderer, this.window, this.assetLoader, this.keyboardInput);
        if (character) {
            dialog.setAvatar(character);
        }
        dialog.setText(text);
        this.activeDialog = dialog;
        this.activeDialog.show();
    }

    public on(eventName: DialogEventName, handler: () => void) {
        this.eventHandlers[eventName].push(handler);
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

    private maxLines: number = 3;

    private text: string;
    private textFontSize: number = 15;
    private textFontWeight: string = "bold";
    private textFontFamily: string = "Arial";
    private textFont: string = `${this.textFontWeight} ${this.textFontSize}px ${this.textFontFamily}`;
    private textX: number;
    private textY: number;
    private textSnippets: string[][];
    private textColor: string = "#fff";

    private currentSnippetIndex: number = 0;

    private boundKeyupHandler: (evt: KeyboardInputEvent) => void;

    private visible: boolean = false;

     constructor(private renderer: Renderer, private window: Window, private assetLoader: AssetLoader, private keyboardInput: KeyboardInput) {
        this.shape = new Rectangle(this.width, this.height, (this.window.innerWidth / 2) - this.width / 2, this.window.innerHeight - this.height - 20);
        this.shape.imageTexture = this.assetLoader.getImage("dialog");
        this.x = this.shape.vertices[0].x;
        this.y = this.shape.vertices[0].y;

        // this.textX calculated when setting text
        this.textY = this.y + 45;
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
        this.bindKeyboardEvents();
        if (this.avatar) {
            this.avatar.startTalking();
        }
        return this;
    }
    
    public hide() {
        if (!this.visible) {
            return this;
        }
        this.visible = false;
        this.renderer.removeObject(this); 
        this.unbindKeyboardEvents();
        if (this.avatar) {
            this.avatar.stopTalking();
        }
        return this;
    }

    public render(ctx: CanvasRenderingContext2D, timeDelta: number) {
        this.shape.render(ctx, timeDelta);
        ctx.font = this.textFont;
        ctx.fillStyle = this.textColor;

        if (this.textSnippets) {
            this.renderTextSnippet(this.textSnippets[this.currentSnippetIndex]);
        }
        if (this.avatar) {
            ctx.font = "bold 12px arial";
            ctx.fillStyle = "#efd960";
            ctx.fillText(this.avatar.name.toUpperCase(), this.textX, this.textY - 22);
            this.avatar.render(ctx, timeDelta);
        }
    }

    private cycleText() {
        if (this.currentSnippetIndex + 1 < this.textSnippets.length) {
            this.currentSnippetIndex++;
        } else {
            this.hide();
        }
    }

    private bindKeyboardEvents() {
        this.boundKeyupHandler = (evt: KeyboardInputEvent) => {
            if (evt.event.key === "Enter" || evt.event.code === "Space") {
                this.cycleText();
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
            if (metrics.width > maxWidth && wordIndex > 0) {
                lines.push(line);
                line = words[wordIndex] + " ";
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        let splitIntoMaxLines = _.chain(_.range(0, lines.length - 1))
            .filter(x => x % this.maxLines === 0)
            .map(x => [lines[x], lines[x + 1], lines[x + 2]])
            .value();

        return splitIntoMaxLines;
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