import { IGameConfig } from "./game.models";
import { SceneManager } from "./scene-manager";
import { Logger } from "../utilities/logger";
import { FrameRenderer } from "../rendering/frame-renderer";
import { KeyboardInput } from "../input/keyboard-input";

export class Game {

    public sceneManager: SceneManager;
    public logger: Logger;
    public keyboardInput: KeyboardInput;
    public renderer: FrameRenderer;
    public window: Window;

    constructor(public readonly canvas: HTMLCanvasElement, private config: IGameConfig) {
        this.canvas = canvas;
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;

        this.window = window;
        this.logger = new Logger();
        this.keyboardInput = new KeyboardInput();
        this.renderer = new FrameRenderer(this.canvas.getContext("2d"), this.window, this.logger);

        this.sceneManager = new SceneManager(this.logger, this);
        this.config.scenes.forEach(x => this.sceneManager.registerScene(x));
        this.sceneManager.load(this.config.bootstrap);
        
        this.renderer.start();
    }

}