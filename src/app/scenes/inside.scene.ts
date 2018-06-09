
import { Scene } from "../engine/game-objects/scene";
import { Game } from "../engine/game-objects/game";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { Rectangle } from "../engine/game-objects/rectangle";
import { AxisDimension, PositionStrategy } from "../engine/physics/moveable";
import { Vector } from "../engine/core/vector";
import { AssetLoader } from "../engine/textures/asset-loader";
import { MathsUtility } from "../engine/utilities/maths";
import { NavGrid } from "../engine/navigation/nav-grid";
import { PathFinder } from "../engine/navigation/pathfinder";
import { Layer } from "../engine/rendering/layer";
import { Guest } from "../models/guest";
import { Player } from "../models/player";
import { Validation } from "../engine/utilities/validation";
import { Target } from "../models/target";
import { Ring } from "../models/ring";

export class InsideScene extends Scene {

    public width: number = 1440;
    public height: number = 960;

    constructor(private readonly game: Game, private readonly assetLoader: AssetLoader) {
        super();
    }

    public preload() {
        return Promise.all([
            this.assetLoader.loadImage("indoor-scene-background", "src/sprites/indoor-scene.png"),
            this.assetLoader.loadImage("indoor-table", "src/sprites/indoor-table.png")
        ]);
    }

    public render() {
        const navGrid = new NavGrid({
            width: this.width,
            height: this.height
        }, this.game.rootRenderer);

        const pathfinder = new PathFinder(navGrid, this.game.rootRenderer);

        const hidingSpots = [];

        const player = this.game.cache.getItem<Player>("player");
        Validation.isTrue(player instanceof Player, "No player found in cache");
        player.move(450, 205, PositionStrategy.Absolute);
        this.game.rootRenderer.addObject(player);

        this.game.camera.setBoundaries(0, this.width, 0, this.height);
        this.game.camera.follow(() => {
            return new Vector(player.x, player.y);
        });

        new Layer("background", 0, 0, this.assetLoader.getImage("indoor-scene-background"), this.game.rootRenderer);
            
        const tableWidth = 154;
        const tableHeight = 142;

        const table1 = new Rectangle(tableWidth, tableHeight, 120, 400);
        table1.key = "table1";
        table1.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table1);

        const table2 = new Rectangle(tableWidth, tableHeight, 120, 650);
        table2.key = "table2";
        table2.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table2);

        const table3 = new Rectangle(tableWidth, tableHeight, 460, 400);
        table3.key = "table3";
        table3.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table3);

        const table4 = new Rectangle(tableWidth, tableHeight, 460, 650);
        table4.key = "table4";
        table4.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table4);

        const table5 = new Rectangle(tableWidth, tableHeight, 820, 400);
        table5.key = "table5";
        table5.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table5);

        const table6 = new Rectangle(tableWidth, tableHeight, 820, 650);
        table6.key = "table6";
        table6.imageTexture = this.assetLoader.getImage("indoor-table");
        hidingSpots.push(table6);

        const topWallBoundary = new Rectangle(this.width, 200, 0, 0);
        navGrid.addBlockedGeometry("top-wall", topWallBoundary);

        // player.addCollidable(table1);
        // player.addCollidable(table2);
        // player.addCollidable(table3);
        // player.addCollidable(table4);
        // player.addCollidable(table5);
        // player.addCollidable(table6);

        new Guest({
            name: "James Aitchison",
            clothing: "blue-suit",
            x: 200,
            y: 200
        }, this.assetLoader, this.game.rootRenderer, pathfinder);

        new Guest({
            name: "Some Guest",
            clothing: "blue-suit",
            x: 500,
            y: 550
        }, this.assetLoader, this.game.rootRenderer, pathfinder);

        new Guest({
            name: "Another Guest",
            clothing: "blue-suit",
            x: 700,
            y: 700
        }, this.assetLoader, this.game.rootRenderer, pathfinder);


        const hiddenLocation = hidingSpots[MathsUtility.randomIntegerRange(0, hidingSpots.length - 1)];

        const target = new Target({
            name: "Noa",
            x: 500,
            y: 500,
            player: player,
            hidingSpots
        }, this.assetLoader, this.game.rootRenderer, pathfinder);

        const ring = new Ring(this.game.rootCanvas.width / 2, 1000, this.assetLoader, this.game.rootRenderer);
        target.hold(ring);


        hidingSpots.forEach(hideableLocation => {
            hideableLocation.beforeRender = () => {
                this.stopObjectOnCollision(player, hideableLocation);
            }
            navGrid.addBlockedGeometry(hideableLocation.key, hideableLocation);
            this.game.rootRenderer.addObject(hideableLocation);
        });

        // pathfinder.debug(true);
    }

    private stopObjectOnCollision(objectToStop: any, current: any): void {
        const hasCollision = CollisionDetector.hasCollision(current, objectToStop);
        if (hasCollision) {
            const currentXVel = objectToStop.xVel < 0 ? 5 : -5;
            const currentYVel = objectToStop.yVel < 0 ? 5 : -5;
            objectToStop.setVelocity(AxisDimension.XY, 0);
            objectToStop.move(currentXVel, currentYVel, PositionStrategy.Relative);
        }
    }



}