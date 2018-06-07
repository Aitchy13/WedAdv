import * as _ from "lodash";

import { Scene } from "./scene";
import { Type, IMap } from "../core/core.models";
import { Logger } from "../utilities/logger";
import { Game } from "./game";
import { AssetLoader } from "../textures/asset-loader";

export class SceneManager {

    private scenes: Type<Scene>[];
    private activeScene: Scene;

    constructor(private readonly logger: Logger, private readonly game: Game, private readonly textureLoader: AssetLoader) {
        this.scenes = [];
    }

    public registerScene(scene: Type<Scene>) {
        if (_.find(this.scenes, x => x === scene)) {
            this.logger.warn(`Scene '${(scene as any).name}' has already been registered. Ignoring registration.`);
            return;
        }
        this.scenes.push(scene);
    }

    public load(scene: Type<Scene>) {
        const registeredScene = _.find(this.scenes, x => x === scene);
        if (!registeredScene) {
            throw new Error(`Cannot load scene '${(scene as any).name}', since it hasn't been registered. Please register before loading.`);
        }
        if (this.activeScene) {
            this.activeScene.destroy();
        }
        this.activeScene = new registeredScene(this.game, this.textureLoader);
        this.activeScene.preload().then(() => {
            this.activeScene.render();
        });
    }

}