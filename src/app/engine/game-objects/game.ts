import { IGameConfig } from "./game.models";
import { SceneManager } from "./scene-manager";
import { Logger } from "../utilities/logger";
import { Renderer } from "../rendering/renderer";
import { KeyboardInput } from "../input/keyboard-input";
import { Time } from "../utilities/time";
import { AssetLoader } from "../textures/asset-loader";
import { MouseInput } from "../input/mouse-input";
import { Camera } from "../rendering/camera";
import { Canvas } from "../core/canvas";

export class Game {

    public sceneManager: SceneManager;
    public logger: Logger;
    public keyboardInput: KeyboardInput;
    public mouseInput: MouseInput;
    public rootRenderer: Renderer;
    public uiRenderer: Renderer;
    public window: Window;
    public document: Document;
    public time: Time;
    public textureLoader: AssetLoader;
    public camera: Camera;

    public rootCanvas: Canvas;
    public uiCanvas: Canvas;

    constructor(public readonly element: HTMLCanvasElement, public config: IGameConfig) {
        this.document = document;
        this.window = window;
        
        this.rootCanvas = new Canvas(element, this.config.width, this.config.height);

        const uiElement = this.document.createElement("canvas");
        uiElement.className = "game-screen";
        this.rootCanvas.element.parentNode.insertBefore(uiElement, this.rootCanvas.element.nextSibling);
        this.uiCanvas = new Canvas(uiElement, this.config.width, this.config.height);

        this.logger = new Logger();
        this.keyboardInput = new KeyboardInput();
        this.mouseInput = new MouseInput(this.uiCanvas);
        this.time = new Time();
        this.camera = new Camera(this.rootCanvas.width, this.rootCanvas.height);

        this.rootRenderer = new Renderer(this.rootCanvas.context, this.window, this.logger, this.time, this.camera);
        this.uiRenderer = new Renderer(this.uiCanvas.context, this.window, this.logger, this.time);
        this.textureLoader = new AssetLoader(this.logger);

        this.sceneManager = new SceneManager(this.logger, this, this.textureLoader);
        this.config.scenes.forEach(x => this.sceneManager.registerScene(x));
        this.sceneManager.load(this.config.bootstrap);
        
        this.rootRenderer.start();
        this.uiRenderer.start();
    }

}