export class Canvas {

    public context: CanvasRenderingContext2D;
    public x: number = 0;
    public y: number = 0;

    constructor(public element: HTMLCanvasElement, public width: number, public height: number) {
        this.context = element.getContext("2d");
        this.element.width = this.width;
        this.element.height = this.height;
    }

}