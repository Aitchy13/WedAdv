import * as _ from "lodash";

import { Scene } from "../engine/game-objects/scene";
import { Shape} from "../engine/game-objects/shape";
import { Game } from "../engine/game-objects/game";
import { CollisionDetector } from "../engine/detectors/collision-detector";
import { Rectangle } from "../engine/game-objects/rectangle";
import { AxisDimension, PositionStrategy } from "../engine/physics/moveable";
import { Vector } from "../engine/game-objects/vector";
import { TextureLoader } from "../engine/textures/texture-loader";
import { SpriteSheetTexture } from "../engine/textures/sprite-texture";

export class TestScene extends Scene {

    private spriteSheets: SpriteSheetTexture[];

    constructor(private readonly game: Game, private readonly textureLoader: TextureLoader) {
        super();
    }

    public preload() {
        return Promise.all<SpriteSheetTexture>([
            this.textureLoader.loadSpriteSheet("fighter", "/src/sprites/fighter.png", [
                {
                    key: "stand-face-down",
                    x: 7,
                    y: 8,
                    width: 16,
                    height: 35
                },
                {
                    key: "stand-face-up",
                    x: 8,
                    y: 151,
                    width: 16,
                    height: 33
                },
                {
                    key: "stand-face-right",
                    x: 72,
                    y: 103,
                    width: 14,
                    height: 35
                },
                {
                    key: "stand-face-left",
                    x: 9,
                    y: 54,
                    width: 14,
                    height: 35
                }
            ]), 
            this.textureLoader.loadSpriteSheet("coin", "/src/sprites/coin.png", [
                {
                    key: "coin-1",
                    x: 0,
                    y: 0,
                    width: 22,
                    height: 23
                },
                {
                    key: "coin-2",
                    x: 30,
                    y: 0,
                    width: 19,
                    height: 23
                },
                {
                    key: "coin-3",
                    x: 62,
                    y: 0,
                    width: 11,
                    height: 23
                },
                {
                    key: "coin-4",
                    x: 92,
                    y: 0,
                    width: 6,
                    height: 23
                },
                {
                    key: "coin-5",
                    x: 117,
                    y: 0,
                    width: 11,
                    height: 23
                },
                {
                    key: "coin-6",
                    x: 140,
                    y: 0,
                    width: 20,
                    height: 23
                }
            ])
        ]).then(response => {
            this.spriteSheets = response;
        });
    }

    public render() {
        const player = new Rectangle(16, 36, 200, 200);
        player.spriteSheet = _.find(this.spriteSheets, x => x.key === "fighter");
        player.spriteKey = "stand-face-up";

        const coin = new Rectangle(22, 23, 100, 100);
        coin.spriteSheet = _.find(this.spriteSheets, x => x.key === "coin");
        coin.spriteKey = "coin-1";

        this.game.renderer.addObject(coin);
        this.game.renderer.addObject(player, {
            beforeRender: [
                (next, currentObj) => {
                    new CollisionDetector(player, coin, () => {
                        this.game.renderer.removeObject(coin);
                    }).detect();
                    next(currentObj);
                }
            ]
        });

        

        this.game.keyboardInput.onKeyDown((evt) => {
            const sensitivity = 3;
            switch (evt.event.key) {
                case "w":
                case "ArrowUp":
                    player.setVelocity(AxisDimension.Y, -sensitivity);
                    player.spriteKey = "stand-face-up";
                    break;
                case "s":
                case "ArrowDown":
                    player.setVelocity(AxisDimension.Y, sensitivity);
                    player.spriteKey = "stand-face-down";
                    break;
                case "a":
                case "ArrowLeft":
                    player.setVelocity(AxisDimension.X, -sensitivity);
                    player.spriteKey = "stand-face-left";
                    break;
                case "d":
                case "ArrowRight":
                    player.setVelocity(AxisDimension.X, sensitivity);
                    player.spriteKey = "stand-face-right";
                    break;
            }
        });
        this.game.keyboardInput.onKeyUp(evt => {
            player.setVelocity(AxisDimension.XY, 0);
        })
    }

}