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
                    y: 7,
                    width: 16,
                    height: 36
                },
                {
                    key: "stand-face-up",
                    x: 7,
                    y: 7,
                    width: 16,
                    height: 36
                }
            ])
        ]).then(response => {
            this.spriteSheets = response;
        });
    }

    public render() {
        const playerSprite = new Rectangle(16, 36, 200, 200);
        playerSprite.spriteSheet = _.find(this.spriteSheets, x => x.key === "fighter");
        playerSprite.spriteKey = "stand-face-up";

        this.game.renderer.addObject(playerSprite);

        this.game.keyboardInput.onKeyDown((evt) => {
            const sensitivity = 2;
            switch (evt.event.key) {
                case "w":
                case "ArrowUp":
                    playerSprite.adjustVelocity(AxisDimension.Y, -sensitivity);
                    break;
                case "s":
                case "ArrowDown":
                    playerSprite.adjustVelocity(AxisDimension.Y, sensitivity);
                    break;
                case "a":
                case "ArrowLeft":
                    playerSprite.adjustVelocity(AxisDimension.X, -sensitivity);
                    break;
                case "d":
                case "ArrowRight":
                    playerSprite.adjustVelocity(AxisDimension.X, sensitivity);
                    break;
            }
        });
    }

}