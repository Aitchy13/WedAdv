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

        Promise.all([
            game.assetLoader.loadSpriteSheet("male-guest-blue", "src/sprites/male-guest-blue.png", "src/sprites/male-guest-blue.json"),
            game.assetLoader.loadSpriteSheet("bride", "src/sprites/bride.png", "src/sprites/bride.json"),
            game.assetLoader.loadSpriteSheet("bride-dialog", "src/sprites/bride-dialog.png", "src/sprites/bride-dialog.json"),
            game.assetLoader.loadSpriteSheet("groom", "src/sprites/groom.png", "src/sprites/groom.json"),
            game.assetLoader.loadSpriteSheet("groom-dialog", "src/sprites/groom-dialog.png", "src/sprites/groom-dialog.json"),
            game.assetLoader.loadSpriteSheet("ring", "src/sprites/ring.png", "src/sprites/ring.json"),
            game.assetLoader.loadSpriteSheet("noa", "src/sprites/noa.png", "src/sprites/noa.json"),
            game.assetLoader.loadImage("dialog", "src/sprites/dialog.png"),
            game.assetLoader.loadImage("dialog-arrow", "src/sprites/dialog-arrow.png"),
            game.assetLoader.loadSound("running", "src/sounds/running.wav"),
            game.assetLoader.loadSound("menu-open", "src/sounds/menu-open.wav"),
            game.assetLoader.loadSound("menu-close", "src/sounds/menu-close.wav"),
            game.assetLoader.loadSound("mouseclick", "src/sounds/mouseclick1.ogg"),
            game.assetLoader.loadSpriteSheet("vicar", "src/sprites/vicar.png", "src/sprites/vicar.json"),
            game.assetLoader.loadSpriteSheet("countdown", "src/sprites/countdown.png", "src/sprites/countdown.json"),
            game.assetLoader.loadSound("menu-select", "src/sounds/click3.ogg")
        ] as any).then(() => {
            game.start();
        })
        

        
    }

}