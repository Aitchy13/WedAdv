import { Scene } from "../engine/game-objects/scene";
import { Rectangle, AxisDimension } from "../engine/game-objects/rectangle";
import { Game } from "../engine/game-objects/game";
import { CollisionDetector } from "../engine/detectors/collision-detector";

export class TestScene extends Scene {

    constructor(private readonly game: Game) {
        super();
    }

    public render() {
        const greenCube = new Rectangle(50, 50, 100, 0);
        greenCube.setVelocity(AxisDimension.X, 0)
            .setColor("green");

        const redCube = new Rectangle(50, 50, this.game.canvas.width - 50, 100);
        redCube.setVelocity(AxisDimension.X, -5)
            .setColor("red");

        this.game.keyboardInput.onKeyDown((evt) => {
                const sensitivity = 1;
                switch (evt.event.key) {
                    case "w":
                    case "ArrowUp":
                        greenCube.adjustVelocity(AxisDimension.Y, -sensitivity);
                        break;
                    case "s":
                    case "ArrowDown":
                        greenCube.adjustVelocity(AxisDimension.Y, sensitivity);
                        break;
                    case "a":
                    case "ArrowLeft":
                        greenCube.adjustVelocity(AxisDimension.X, -sensitivity);
                        break;
                    case "d":
                    case "ArrowRight":
                        greenCube.adjustVelocity(AxisDimension.X, sensitivity);
                        break;
                }
            });

            this.game.renderer.addObject(greenCube, {
                beforeRender: [
                    (next, currentObj) => {
                        const collidedObjects = new CollisionDetector(currentObj, redCube, (detectingObject, collidedObject) => {
    
                            const velocity = detectingObject.getVelocity();
                            if (velocity.x > 0) {
                                detectingObject.x = detectingObject.x - detectingObject.getVelocity().x + collidedObject.getVelocity().x;
                            } else if (velocity.x < 0) {
                                detectingObject.x = detectingObject.x - detectingObject.getVelocity().x - collidedObject.getVelocity().x;
                            }
    
                            if (velocity.y > 0) {
                                detectingObject.y = detectingObject.y - detectingObject.getVelocity().y + collidedObject.getVelocity().y;
                            } else if (velocity.y < 0) {
                                detectingObject.y = detectingObject.y - detectingObject.getVelocity().y - collidedObject.getVelocity().y;
                            }
                            
                            detectingObject.setVelocity(AxisDimension.XY, 0);
                            collidedObject.setVelocity(AxisDimension.XY, 0);
                        }).detect();
                        next(currentObj);
                    }
                ]
            });
            this.game.renderer.addObject(redCube);
    }

}