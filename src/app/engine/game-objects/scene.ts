export abstract class Scene {

    constructor() {}

    public preload(): Promise<any> {
        return Promise.resolve();
    }

    public render(): void {

    }

    public destroy(): void {

    }

}