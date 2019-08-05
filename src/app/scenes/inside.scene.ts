
import { Scene } from "../engine/game-objects/scene";
import { Game } from "../engine/game-objects/game";
import { Rectangle } from "../engine/game-objects/rectangle";
import { PositionStrategy } from "../engine/physics/moveable";
import { Vector } from "../engine/core/vector";
import { AssetLoader } from "../engine/textures/asset-loader";
import { NavGrid } from "../engine/navigation/nav-grid";
import { PathFinder } from "../engine/navigation/pathfinder";
import { Layer } from "../engine/rendering/layer";
import { Guest } from "../models/guest";
import { Player } from "../models/player";
import { Validation } from "../engine/utilities/validation";
import { Target, IHidingSpot } from "../models/target";
import { Ring } from "../models/ring";
import { Table } from "../models/table";
import { Door } from "../models/door";
import { OutsideScene } from "./outside.scene";
import { Countdown } from "../models/countdown";
import { Sound } from "../engine/audio/sound";
import { Direction } from "../engine/core/core.models";

export class InsideScene extends Scene {

    public width: number = 1440;
    public height: number = 960;

    public player: Player;
    public target: Target;

    public countdown: Countdown;
    public exit: Door;
    public ring: Ring;
    public tables: Table[];

    private enemySound: Sound;
    private completionSound: Sound;

    constructor(private readonly game: Game, private readonly assetLoader: AssetLoader) {
        super();
    }

    public preload() {
        return Promise.all([
            this.assetLoader.loadImage("indoor-scene-background", "src/sprites/indoor-scene.png"),
            this.assetLoader.loadImage("indoor-table", "src/sprites/table.png")
        ]);
    }

    public destroy() {
        this.game.rootRenderer.removeAllObjects();
        this.player.removeCollidables();
        this.player.removeInteractables();
    }

    public render() {
        const navGrid = new NavGrid({
            width: this.width,
            height: this.height
        }, this.game.rootRenderer);

        const pathfinder = new PathFinder(navGrid, this.game.rootRenderer);

        this.player = this.game.cache.getItem<Player>("player");
        Validation.isTrue(this.player instanceof Player, "No player found in cache");
        this.player.move(450, 180, PositionStrategy.Absolute);
        this.player.faceDirection(Direction.South);
        this.game.rootRenderer.addObject(this.player);

        this.game.camera.setBoundaries(0, this.width, 0, this.height);
        this.game.camera.follow(() => {
            return new Vector(this.player.x, this.player.y);
        });

        new Layer("background", 0, 0, this.assetLoader.getImage("indoor-scene-background"), this.game.rootRenderer);

        this.tables = [];
        const table1 = new Table("table1", 120, 320, this.assetLoader, this.game.rootRenderer);
        this.tables.push(table1);

        const table2 = new Table("table2", 120, 640, this.assetLoader, this.game.rootRenderer);
        this.tables.push(table2);

        const table3 = new Table("table3", 460, 320, this.assetLoader, this.game.rootRenderer);
        this.tables.push(table3);

        const table4 = new Table("table4", 460, 640, this.assetLoader, this.game.rootRenderer);
        this.tables.push(table4);

        const table5 = new Table("table5", 820, 320, this.assetLoader, this.game.rootRenderer);
        this.tables.push(table5);

        const table6 = new Table("table6", 820, 640, this.assetLoader, this.game.rootRenderer);
        this.tables.push(table6);

        const topBoundary = new Rectangle(this.width, 160, 0, 0);
        const leftBoundary = new Rectangle(10, this.height, 0, 0);
        const rightBoundary = new Rectangle(10, this.height, this.width - 10, 0);
        const bottomBoundary = new Rectangle(this.width, 10, 0, this.height - 10);

        this.player.addCollidable(topBoundary);
        this.player.addCollidable(leftBoundary);
        this.player.addCollidable(rightBoundary);
        this.player.addCollidable(bottomBoundary);

        navGrid.addBlockedGeometry("top-wall", topBoundary);
        navGrid.addBlockedGeometry("left-wall", leftBoundary);
        navGrid.addBlockedGeometry("right-wall", rightBoundary);
        navGrid.addBlockedGeometry("bottom-wall", bottomBoundary);

        this.player.addCollidable(topBoundary);

        this.exit = new Door("door-1", 411, 86, this.game.sceneManager);
        this.exit.setExit(OutsideScene);

        const hidingSpots: IHidingSpot[] = [];

        this.tables.forEach(x => {
            this.player.addCollidable(x);
            this.player.addInteractable(x);
            hidingSpots.push(x);
            x.show();
        });

        // new Guest({
        //     name: "James Aitchison",
        //     gender: "male",
        //     x: 200,
        //     y: 200
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Some Guest",
        //     gender: "female",
        //     x: 500,
        //     y: 550
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     gender: "female",
        //     x: 700,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);
        
        // new Guest({
        //     name: "Another Guest",
        //     gender: "female",
        //     x: 780,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     gender: "female",
        //     x: 780,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     gender: "female",
        //     x: 780,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     gender: "female",
        //     x: 780,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     gender: "male",
        //     x: 780,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     gender: "male",
        //     x: 780,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     gender: "male",
        //     x: 780,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     gender: "male",
        //     x: 780,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     gender: "male",
        //     x: 780,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // let targetGrid = new NavGrid({
        //     width: this.width,
        //     height: this.height
        // }, this.game.rootRenderer);
        // let targetPathFinder = new PathFinder(targetGrid, this.game.rootRenderer);

        this.enemySound = this.assetLoader.getSound("enemy");
        this.completionSound = this.assetLoader.getSound("happy");

        this.target = new Target({
            name: "Noa",
            x: 500,
            y: 500,
            player: this.player,
            hidingSpots
        }, this.assetLoader, this.game.rootRenderer, pathfinder);
        this.target.hideIn();

        this.ring = new Ring(this.game.rootCanvas.width / 2, 1000, this.assetLoader, this.game.rootRenderer);
        this.target.hold(this.ring);

        this.target.on("caught", () => {
            this.onTargetCaught();
        });
        this.target.on("found", () => {
            this.onTargetFound();
        });

        this.player.addInteractable(this.target);

        // this.player.addInteractable(ring);

        hidingSpots.forEach(hideableLocation => {
            navGrid.addBlockedGeometry(hideableLocation.key, hideableLocation.shape);
        });

        this.countdown = this.game.cache.getItem("countdown");
        this.game.uiRenderer.addObject(this.countdown);

        this.player.disableControls();
        this.player.stopMovement();
        this.game.dialogService.show("Hmm... she must be somewhere inside here... Maybe she's hiding?", this.player).then(() => {
            this.player.enableControls();
        });

        // pathfinder.debug(true);
    }

    private onTargetFound() {
        this.assetLoader.getSound("build-up").stop();
        this.enemySound.loop();
        this.tables.forEach(x => this.player.removeInteractable(x));
        this.player.stopMovement();
        this.player.disableControls();
        this.game.dialogService.show("Ha ha you found me, but you can't catch me!", this.target).then(() => {
            this.player.enableControls();
            this.target.runAway();
        });
    }

    private onTargetCaught() {
        this.player.stopMovement();
        this.player.disableControls();
        this.countdown.stop();
        this.enemySound.stop();
        this.completionSound.play();
        this.player.removeInteractables();
        this.game.dialogService.show("Waaaaaaaaaaaaaaaa... you caught me! I guess I'll have to find another Harrison...", this.target).then(() => {
            return this.target.runTo({ x: this.exit.x + 50, y: this.exit.y + 120 });
        }).then(() => {
            this.target.remove();
            this.player.enableControls();
            this.player.addInteractable(this.ring);
            this.player.addInteractable(this.exit);
            this.countdown.start();
        });
    }

}