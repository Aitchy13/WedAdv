import { BitmapFont } from "./bitmap-font";
import { mock, instance, when, verify } from "ts-mockito";
import { AssetLoader } from "../../textures/asset-loader";
import { SpriteSheet } from "../../textures/sprite-texture";
import { BitmapCharacter } from "./bitmap-character";

describe("Bitmap Font", () => {

    const key = "test-font";
    const imagePath = "base/app/engine/ui/bitmap-font-test.png";
    const spriteJsonPath = "base/app/engine/ui/bitmap-font-test.json";

    let bitmapFont: BitmapFont;
    let loaded = false;

    let mockAssetLoader: AssetLoader;
    let spriteSheet: SpriteSheet;

    beforeEach((done) => {
        mockAssetLoader = mock(AssetLoader);

        const spriteImage = new Image();
        spriteImage.width = 35;
        spriteImage.height = 45;
        spriteSheet = new SpriteSheet(key, spriteImage);
        spriteSheet.frames = [
            {
                key: "0",
                x: 105,
                y: 0,
                width: 35,
                height: 45
            },
            {
                key: "1",
                x: 140,
                y: 0,
                width: 35,
                height: 45
            }
        ];

        when(mockAssetLoader.loadSpriteSheet(key, imagePath, spriteJsonPath)).thenResolve(spriteSheet);
        bitmapFont = new BitmapFont("test-font", instance(mockAssetLoader));
        bitmapFont.load(imagePath, spriteJsonPath).then((result) => {
            loaded = true;
            done();
        });
    });

    it("must load asynchronously",  () => {
        expect(loaded).toBe(true);
    });

    it ("must map a character to a bitmap character", () => {
        bitmapFont.setCharacter("0", "0");
        expect(bitmapFont.getCharacter("0")).toEqual(jasmine.any(BitmapCharacter));
    });

    it ("must expose a list of available characters", () => {
        expect(bitmapFont.listCharacters()).toEqual(["0", "1"]);
    });

    it ("must expose the character width", () => {
        expect(bitmapFont.charWidth).toBe(35);
    });

    it ("must expose the character height", () => {
        expect(bitmapFont.charHeight).toBe(45);
    });

});