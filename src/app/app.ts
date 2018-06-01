import { Game } from "./engine/game-objects/game";
import { InsideScene } from "./scenes/inside.scene";
import { OutsideScene } from "./scenes/outside.scene";

export class App {

    constructor(window: Window, rootCanvas: HTMLCanvasElement) {
        const game = new Game(rootCanvas, {
            width: window.innerWidth,
            height: window.innerHeight,
            scenes: [
                OutsideScene,
                InsideScene
            ],
            bootstrap: OutsideScene
        });
    }

}