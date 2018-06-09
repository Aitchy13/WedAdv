
import { Scene } from "../engine/game-objects/scene";
import { Game } from "../engine/game-objects/game";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { Rectangle } from "../engine/game-objects/rectangle";
import { AxisDimension, PositionStrategy } from "../engine/physics/moveable";
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

        const player = this.game.cache.getItem<Player>("player");
        Validation.isTrue(player instanceof Player, "No player found in cache");
        player.move(450, 205, PositionStrategy.Absolute);
        this.game.rootRenderer.addObject(player);

        this.game.camera.setBoundaries(0, this.width, 0, this.height);
        this.game.camera.follow(() => {
            return new Vector(player.x, player.y);
        });

        new Layer("background", 0, 0, this.assetLoader.getImage("indoor-scene-background"), this.game.rootRenderer);

        const tables: Table[] = [];
        const table1 = new Table("table1", 120, 400, this.assetLoader, this.game.rootRenderer);
        tables.push(table1);

        const table2 = new Table("table2", 120, 650, this.assetLoader, this.game.rootRenderer);
        tables.push(table2);

        const table3 = new Table("table3", 460, 400, this.assetLoader, this.game.rootRenderer);
        tables.push(table3);

        const table4 = new Table("table4", 460, 650, this.assetLoader, this.game.rootRenderer);
        tables.push(table4);

        const table5 = new Table("table5", 820, 400, this.assetLoader, this.game.rootRenderer);
        tables.push(table5);

        const table6 = new Table("table6", 820, 650, this.assetLoader, this.game.rootRenderer);
        tables.push(table6);

        const topWallBoundary = new Rectangle(this.width, 200, 0, 0);
        navGrid.addBlockedGeometry("top-wall", topWallBoundary);

        const hidingSpots: IHidingSpot[] = [];

        tables.forEach(x => {
            player.addCollidable(x);
            player.addInteractable(x);
            hidingSpots.push(x);
            x.show();
        });

        // new Guest({
        //     name: "James Aitchison",
        //     clothing: "blue-suit",
        //     x: 200,
        //     y: 200
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Some Guest",
        //     clothing: "blue-suit",
        //     x: 500,
        //     y: 550
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        // new Guest({
        //     name: "Another Guest",
        //     clothing: "blue-suit",
        //     x: 700,
        //     y: 700
        // }, this.assetLoader, this.game.rootRenderer, pathfinder);

        const target = new Target({
            name: "Noa",
            x: 500,
            y: 500,
            player: player,
            hidingSpots
        }, this.assetLoader, this.game.rootRenderer, pathfinder);

        const ring = new Ring(this.game.rootCanvas.width / 2, 1000, this.assetLoader, this.game.rootRenderer);
        target.hold(ring);

        player.addInteractable(ring);

        hidingSpots.forEach(hideableLocation => {
            navGrid.addBlockedGeometry(hideableLocation.key, hideableLocation.shape);
        });

        // pathfinder.debug(true);
    }

}