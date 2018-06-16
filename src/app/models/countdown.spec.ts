import { mock, when, instance } from "ts-mockito";

import { Countdown, ICountdownFontOverride } from "./countdown"; 
import { AssetLoader } from "../engine/textures/asset-loader";
import { SpriteSheet } from "../engine/textures/sprite-texture";

describe("Countdown", () => {

    let countdown: Countdown;

    let mockAssetLoader: AssetLoader;
    let spriteSheet: SpriteSheet;

    const fontOverride: ICountdownFontOverride = {
        key: "test-font",
        path: "base/app/engine/ui/bitmap-font-test.png",
        jsonPath: "base/app/engine/ui/bitmap-font-test.json"
    }

    beforeEach((done) => {
        mockAssetLoader = mock(AssetLoader);

        const spriteImage = new Image();
        spriteSheet = new SpriteSheet(fontOverride.key, spriteImage);
        spriteSheet.frames = [
            {
                "key": "0",
                "x": 105,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": "1",
                "x": 140,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": "2",
                "x": 175,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": "3",
                "x": 210,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": "4",
                "x": 245,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": "5",
                "x": 280,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": "6",
                "x": 315,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": "7",
                "x": 350,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": "8",
                "x": 385,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": "9",
                "x": 420,
                "y": 0,
                "width": 35,
                "height": 45
            },
            {
                "key": ":",
                "x": 455,
                "y": 0,
                "width": 35,
                "height": 45
            }
        ];
        when(mockAssetLoader.loadSpriteSheet(fontOverride.key, fontOverride.path, fontOverride.jsonPath)).thenResolve(spriteSheet);
        countdown = new Countdown(0, 0, 5000, instance(mockAssetLoader), fontOverride);
        countdown.load().then(() => done());
    });

    it("must format the seconds correctly", () => {
        countdown.setSeconds(60 * 5);
        expect(countdown.getFormatted()).toBe("5:00");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:59");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:58");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:57");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:56");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:55");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:54");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:53");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:52");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:51");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:50");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:49");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:48");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:47");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:46");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:45");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:44");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:43");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:42");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:41");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:40");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:39");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:38");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:37");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:36");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:35");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:34");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:33");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:32");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:31");
        countdown.tick();
        expect(countdown.getFormatted()).toBe("4:30");
    });

});