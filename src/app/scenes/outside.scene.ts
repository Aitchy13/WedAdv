import { Scene } from "../engine/game-objects/scene";
import { Game } from "../engine/game-objects/game";
import { Rectangle } from "../engine/game-objects/rectangle";
import { Vector } from "../engine/core/vector";
import { AssetLoader } from "../engine/textures/asset-loader";
import { NavGrid } from "../engine/navigation/nav-grid";
import { PathFinder } from "../engine/navigation/pathfinder";
import { Easing } from "../engine/animation/easing";
import { Layer } from "../engine/rendering/layer";
import { Player } from "../models/player";
import { Button } from "../engine/ui/button";
import { Sound } from "../engine/audio/sound";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { InsideScene } from "./inside.scene";
import { Tween } from "../engine/animation/tween";
import { Ring } from "../models/ring";
import { PositionStrategy } from "../engine/physics/moveable";
import { Pastor } from "../models/pastor";
import { Direction } from "../engine/core/core.models";
import { Target } from "../models/target";
import { Countdown } from "../models/countdown";

export class OutsideScene extends Scene {

    public width: number = 1440;
    public height: number = 1800;

    private gameTitle: Layer;
    private startButton: Button;

    private instruction: Layer;
    private groomSelection: Button;
    private brideSelection: Button;
    private playButton: Button;

    private selectedPlayer: Player;
    private groom: Player;
    private bride: Player;
    private pastor: Pastor;
    private ring: Ring;
    private target: Target;

    private menuSelectSound: Sound;
    private pathfinder: PathFinder;

    private countdown: Countdown;

    constructor(private readonly game: Game, private readonly assetLoader: AssetLoader) {
        super();
    }

    public preload() {
        this.countdown = this.game.cache.getItem("countdown") ? this.game.cache.getItem("countdown") : new Countdown(this.game.uiCanvas.width - 260, 30, 60 * 5, this.game.assetLoader)
        return Promise.all([
            this.assetLoader.loadImage("outdoor-scene-background", "src/sprites/outdoor-scene.png"),
            this.assetLoader.loadImage("cloud-1", "src/sprites/cloud-1.png"),
            this.assetLoader.loadImage("cloud-2", "src/sprites/cloud-2.png"),
            this.assetLoader.loadImage("game-title", "src/sprites/game-title.png"),
            this.assetLoader.loadImage("select-player-text", "src/sprites/select-player-text.png"),
            this.assetLoader.loadImage("groom-player-selection", "src/sprites/groom-player-selection.png"),
            this.assetLoader.loadImage("bride-player-selection", "src/sprites/bride-player-selection.png"),
            this.assetLoader.loadImage("start-button", "src/sprites/start-button.png"),
            this.assetLoader.loadImage("play-button", "src/sprites/play-button.png"),
            this.assetLoader.loadImage("wedding-arch", "src/sprites/wedding-arch.png"),
            this.assetLoader.loadImage("pew", "src/sprites/pew.png"),
            this.countdown.load()
        ] as any);
    }

    public render() {
        this.game.camera.setBoundaries(0, this.width, 0, this.height);

        const sky = new Rectangle(this.width, 934, 0, 0);
        sky.gradient = [["#b1e0f2", 1], ["#7d9bf2", 0]];

        new Layer("sky", 0, 0, sky, this.game.rootRenderer);
        new Layer("outdoor-scene", 0, 850, this.assetLoader.getImage("outdoor-scene-background"), this.game.rootRenderer);

        const navGrid = new NavGrid({
            width: this.width,
            height: this.height + 200,
            x: 0,
            y: 1130
        }, this.game.rootRenderer);

        this.pathfinder = new PathFinder(navGrid, this.game.rootRenderer);

        if (this.game.cache.getItem("player")) {
            this.restoreScene();
            return;
        }

        this.showTitleScreen();
    }

    public destroy() {
        this.game.rootRenderer.removeAllObjects();
    }

    private showTitleScreen() {
        const durationModifier = 0.7;
        const cloudA = new Layer("cloud-a", 430, 190, this.assetLoader.getImage("cloud-1"), this.game.rootRenderer);
        const cloudATween = new Tween(cloudA).to(new Vector(470, 190), 8000 * durationModifier, Easing.linear).yoyo().repeat();
        cloudATween.start();

        const cloudB = new Layer("cloud-b", 360, 82, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudBTween = new Tween(cloudB).to(new Vector(410, 82), 7900 * durationModifier, Easing.linear).yoyo().repeat();
        cloudBTween.start();

        const cloudC = new Layer("cloud-c", 793, 55, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudCTween = new Tween(cloudC).to(new Vector(820, 55), 8100 * durationModifier, Easing.linear).yoyo().repeat();
        cloudCTween.start();

        const cloudD = new Layer("cloud-d", 860, 210, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudDTween = new Tween(cloudD).to(new Vector(910, 210), 8300 * durationModifier, Easing.linear).yoyo().repeat();
        cloudDTween.start();

        const cloudE = new Layer("cloud-e", 1232, 248, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudETween = new Tween(cloudE).to(new Vector(1250, 248), 7950 * durationModifier, Easing.linear).yoyo().repeat();
        cloudETween.start();

        const cloudF = new Layer("cloud-f", 1093, 431, this.assetLoader.getImage("cloud-1"), this.game.rootRenderer);
        const cloudFTween = new Tween(cloudF).to(new Vector(1150, 431), 7800 * durationModifier, Easing.linear).yoyo().repeat();
        cloudFTween.start();

        const cloudG = new Layer("cloud-g", 1223, 620, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudGTween = new Tween(cloudG).to(new Vector(1280, 620), 8000 * durationModifier, Easing.linear).yoyo().repeat();
        cloudGTween.start();

        const cloudH = new Layer("cloud-h", 353, 500, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudHTween = new Tween(cloudH).to(new Vector(400, 500), 8100 * durationModifier, Easing.linear).yoyo().repeat();
        cloudHTween.start();

        const cloudI = new Layer("cloud-i", 100, 575, this.assetLoader.getImage("cloud-1"), this.game.rootRenderer);
        const cloudITween = new Tween(cloudI).to(new Vector(140, 575), 8200 * durationModifier, Easing.linear).yoyo().repeat();
        cloudITween.start();

        const cloudJ = new Layer("cloud-j", 184, 380, this.assetLoader.getImage("cloud-2"), this.game.rootRenderer);
        const cloudJTween = new Tween(cloudJ).to(new Vector(200, 380), 8400, Easing.easeInOutCubic).yoyo().repeat();
        cloudJTween.start();


        const gameTitleTexture = this.assetLoader.getImage("game-title");
        this.gameTitle = new Layer("game-title", (this.game.rootCanvas.width / 2) - gameTitleTexture.width / 2, 300, gameTitleTexture, this.game.rootRenderer);

        const startButtonTexture = this.assetLoader.getImage("start-button");
        this.startButton = new Button({
            width: 216,
            height: 60,
            x: (this.game.rootCanvas.width / 2) - startButtonTexture.width / 2,
            y: 476,
            texture: this.assetLoader.getImage("start-button")
        }, this.game.mouseInput, this.game.rootRenderer);
        this.menuSelectSound = this.assetLoader.getSound("menu-select");
        this.menuSelectSound.load();
        this.startButton.on("click", () => {
            this.menuSelectSound.play();
            this.hideTitleScreen();
            this.showPlayerSelection();
        });
    }

    private hideTitleScreen() {
        this.gameTitle.hide();
        this.startButton.hide();
    }

    private showPlayerSelection() {
        const selectPlayerText = this.assetLoader.getImage("select-player-text");
        this.instruction = new Layer("select-player-text", (this.game.rootCanvas.width / 2) - (selectPlayerText.width / 2), 300, selectPlayerText, this.game.rootRenderer);

        this.renderGroom();
        this.renderBride();

        this.groom.faceDirection(Direction.East);
        this.bride.faceDirection(Direction.West);

        this.selectedPlayer = this.groom;

        const groomSelectionTexture = this.assetLoader.getImage("groom-player-selection");

        const selectionOffset = 100;

        this.groomSelection = new Button({
            width: 158,
            height: 158,
            x: (this.game.rootCanvas.width / 2) - (groomSelectionTexture.width / 2) - selectionOffset,
            y: 340,
            texture: groomSelectionTexture
        }, this.game.mouseInput, this.game.rootRenderer);
        this.groomSelection.on("click", () => {
            this.menuSelectSound.play();
            this.selectedPlayer = this.groom;
        });

        const brideSelectionTexture = this.assetLoader.getImage("bride-player-selection");

        this.brideSelection = new Button({
            width: 158,
            height: 158,
            x: (this.game.rootCanvas.width / 2) - (brideSelectionTexture.width / 2) + selectionOffset,
            y: 340,
            texture: brideSelectionTexture
        }, this.game.mouseInput, this.game.rootRenderer);
        this.brideSelection.on("click", () => {
            this.menuSelectSound.play();
            this.selectedPlayer = this.bride;
        });

        const playButtonTexture = this.assetLoader.getImage("play-button");
        this.playButton = new Button({
            width: 216,
            height: 60,
            x: (this.game.rootCanvas.width / 2) - playButtonTexture.width / 2,
            y: 520,
            texture: this.assetLoader.getImage("play-button")
        }, this.game.mouseInput, this.game.rootRenderer);

        this.playButton.on("click", () => {
            this.menuSelectSound.play();
            this.startSequence();
        });

    }

    private renderGroom() {
        this.groom = new Player({
            model: "groom",
            x: (this.game.rootCanvas.width / 2) - (36 / 2) - 20,
            y: 1157
        }, this.assetLoader, this.game.rootRenderer, this.pathfinder, this.game.keyboardInput);
    }

    private renderBride() {
        this.bride = new Player({
            model: "bride",
            x: (this.game.rootCanvas.width / 2) - (43 / 2) + 20,
            y: 1157
        }, this.assetLoader, this.game.rootRenderer, this.pathfinder, this.game.keyboardInput);
    }

    private hidePlayerSelectionScreen() {
        this.instruction.hide();
        this.groomSelection.hide();
        this.brideSelection.hide();
        this.playButton.hide();
    }

    private startSequence() {
        this.hidePlayerSelectionScreen();
        this.renderLevel();
        

        this.game.camera.moveTo(this.selectedPlayer, 4000, Easing.easeInOutCubic).then(() => {
            this.game.camera.follow(() => {
                return new Vector(this.selectedPlayer.x, this.selectedPlayer.y);
            });
            this.beginCeremony();
        });
    }

    private renderLevel() {
        const arch = new Layer("wedding-arch", 665, 1067, this.assetLoader.getImage("wedding-arch"), this.game.rootRenderer);

        const firstRowY = 1214;
        const rightSectionSpacing = 605;
        const spacing = 70;
        new Layer("pew-a", 223, firstRowY, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-b", 414, firstRowY, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-c", 223, firstRowY + spacing, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-d", 414, firstRowY + spacing, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-e", 223, firstRowY + spacing * 2, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-f", 414, firstRowY + spacing * 2, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-g", 223, firstRowY + spacing * 3, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-h", 414, firstRowY + spacing * 3, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-i", 223, firstRowY + spacing * 4, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-j", 414, firstRowY + spacing * 4, this.assetLoader.getImage("pew"), this.game.rootRenderer);

        new Layer("pew-h", 223 + rightSectionSpacing, firstRowY, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-k", 414 + rightSectionSpacing, firstRowY, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-l", 223 + rightSectionSpacing, firstRowY + spacing, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-m", 414 + rightSectionSpacing, firstRowY + spacing, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-n", 223 + rightSectionSpacing, firstRowY + spacing * 2, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-o", 414 + rightSectionSpacing, firstRowY + spacing * 2, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-p", 223 + rightSectionSpacing, firstRowY + spacing * 3, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-q", 414 + rightSectionSpacing, firstRowY + spacing * 3, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-r", 223 + rightSectionSpacing, firstRowY + spacing * 4, this.assetLoader.getImage("pew"), this.game.rootRenderer);
        new Layer("pew-s", 414 + rightSectionSpacing, firstRowY + spacing * 4, this.assetLoader.getImage("pew"), this.game.rootRenderer);

        const exit = new Rectangle(150, 2, (this.width / 2) - 150 / 2, this.height - 2);
        exit.beforeRender = () => {
            if (CollisionDetector.hasCollision(this.selectedPlayer, exit)) {
                this.game.sceneManager.load(InsideScene);
                this.game.cache.addItem("player", this.selectedPlayer);
            }
        };
        this.game.rootRenderer.addObject(exit);

        this.pastor = new Pastor((this.game.rootCanvas.width / 2) - (38 / 2), 1130, this.assetLoader, this.game.rootRenderer, this.pathfinder);
        this.ring = new Ring(0, 0, this.assetLoader, this.game.rootRenderer);
        this.target = new Target({
            name: "Noa",
            x: (this.game.rootCanvas.width / 2) - (30 / 2),
            y:  this.height,
            player: this.selectedPlayer,
            hidingSpots: [],
        }, this.assetLoader, this.game.rootRenderer, this.pathfinder);
        this.target.hold(this.ring);

        const topBoundary = new Rectangle(this.width, 50, 0, 1050);
        this.selectedPlayer.addCollidable(topBoundary);
        this.game.rootRenderer.addObject(topBoundary);

        this.game.uiRenderer.addObject(this.countdown);
    }

    private beginCeremony() {
        const sleep = (amountMs: number) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, amountMs);
            })
        }

        this.game.dialogService.show("We are gathered here today to witness the marriage between ... Harrison Steel and Hannah Moody. Now, normally I would proceed to discuss the importance of love, kindness and sharing, but I've got <<INSERT REASON>>, so I'm going to skip on ahead. So without further a due, could the ring bearer please present the rings?", this.pastor).then(() => {
            return sleep(2000);
        }).then(() => {
            this.bride.faceDirection(Direction.South);
            return this.game.dialogService.show("Noa nug ... its time for mom to marry Harrison... and we're gonna need those rings to do it!", this.bride).then(() => sleep(1000));
        }).then(() => {
            this.groom.faceDirection(Direction.South);
            return this.target.runTo({ x: this.bride.x, y: this.bride.y + 200 });
        }).then(() => {
            return this.game.dialogService.show("But he's my honey! You go find a man ... and I'll marry Harrison!", this.target);
        }).then(() => {
            return this.game.dialogService.show("hahahahahaha", this.groom);
        }).then(() => {
            return this.game.dialogService.show("He's mine too! We've already talked about this ... Get over here with the rings!", this.bride);
        }).then(() => {
            return this.game.dialogService.show("If you want em', come get em'!", this.target);
        }).then(() => {
            return this.target.runTo({ x: this.target.x, y: this.height }).then(() => {
                // TODO: play door open sound
                return undefined;
            })
        }).then(() => {
            this.groom.faceDirection(Direction.East);
            this.bride.faceDirection(Direction.West);
            return this.game.dialogService.show("I'll go get her, you stay here.", this.selectedPlayer);
        }).then(() => {
            return this.game.dialogService.show("Ok, but hurry ... you've got 5 minutes until I get cold feet ... (seriously, the timer starts soon)", this.selectedPlayer.model === "bride" ? this.groom : this.bride);
        }).then(() => {
            return this.game.dialogService.show("I'm getting too old for this...", this.pastor);
        }).then(() => {
            // TODO: Start timer
            this.selectedPlayer.enableControls();
            this.countdown.start();
            this.game.cache.addItem("countdown", this.countdown);
        });
    }

    private restoreScene() {
        this.selectedPlayer = this.game.cache.getItem("player");
        this.selectedPlayer.model === "groom" ? this.renderBride() : this.renderGroom();
        this.selectedPlayer.move(this.game.rootCanvas.width / 2, this.height - 100, PositionStrategy.Absolute);

        this.renderLevel();

        this.game.camera.follow(() => new Vector(this.selectedPlayer.x, this.selectedPlayer.y));

        this.game.rootRenderer.addObject(this.selectedPlayer);
    }

}