import { App } from "./app/app";
import "./styles/style.scss";

new App(document, window).initialise(document.getElementById("game-screen") as HTMLCanvasElement);