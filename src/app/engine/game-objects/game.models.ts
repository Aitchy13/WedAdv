import { Scene } from "./scene";
import { TestScene } from "../../scenes/test-scene";
import { Type } from "../core/core.models";


export interface IGameConfig {
    width: number;
    height: number;
    scenes: Array<Type<Scene>>;
    bootstrap: Type<Scene>;
}