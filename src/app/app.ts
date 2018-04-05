import { Game } from "./engine/game-objects/game";
import { TestScene } from "./scenes/test-scene";

export class App {

    constructor(window: Window, canvas: HTMLCanvasElement) {
        const game = new Game(canvas, {
            width: window.innerWidth,
            height: window.innerHeight,
            scenes: [
                TestScene
            ],
            bootstrap: TestScene
        });
    }

}