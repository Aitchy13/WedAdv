export class ImageTexture {

    public width: number;
    public height: number;
    
    constructor(public key: string, private image: HTMLImageElement) {
        this.width = image.width;
        this.height = image.height;
    }

}