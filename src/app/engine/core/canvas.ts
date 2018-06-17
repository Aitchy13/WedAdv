export class Canvas {

    public context: CanvasRenderingContext2D;
    public x: number = 0;
    public y: number = 0;

    private maxWidth: number = 1440;
    private maxHeight: number = 820;

    constructor(public element: HTMLCanvasElement, public width: number, public height: number) {
        if (this.width > this.maxWidth) {
            this.width = this.maxWidth;
        }
        if (this.height > this.maxHeight) {
            this.height = this.maxHeight;
        }
        this.context = element.getContext("2d");
        this.element.width = this.width;
        this.element.height = this.height;
    }

}