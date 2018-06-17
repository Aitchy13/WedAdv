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
import { DialogService } from "../ui/dialog";
import { GameCache } from "../cache/game-cache";

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
    public assetLoader: AssetLoader;
    public camera: Camera;
    public dialogService: DialogService;
    public cache: GameCache;

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
        this.cache = new GameCache(this.logger);
        this.keyboardInput = new KeyboardInput(this.document);
        this.mouseInput = new MouseInput(this.uiCanvas);
        this.time = new Time();
        this.camera = new Camera(this.rootCanvas.width, this.rootCanvas.height);

        this.rootRenderer = new Renderer(this.rootCanvas.context, this.window, this.logger, this.time, this.camera);
        this.uiRenderer = new Renderer(this.uiCanvas.context, this.window, this.logger, this.time);
        this.assetLoader = new AssetLoader(this.logger);

        this.dialogService = new DialogService(this.keyboardInput, this.uiRenderer, this.uiCanvas, this.assetLoader);

        this.sceneManager = new SceneManager(this.logger, this, this.assetLoader);
        
    }

    public start() {
        this.config.scenes.forEach(x => this.sceneManager.registerScene(x));
        this.sceneManager.load(this.config.bootstrap);
        
        this.rootRenderer.start();
        this.uiRenderer.start();
    }

}