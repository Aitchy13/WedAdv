import * as _ from "lodash";

import { Sound } from "./sound";

xdescribe("Sound", () => {

    let sound: Sound;
    let buffer: AudioBuffer;
    let source: AudioBufferSourceNode;

    beforeEach((done) => {
        sound = new Sound("test", "base/app/engine/audio/sound-test.wav");
        sound.load().then((response) => {
            buffer = response.buffer;
            source = response.source;
            done();
        });
    });

    it("loads an AudioBuffer", () => {
        expect(buffer instanceof AudioBuffer).toBe(true);
    });

    it("loads an AudioBufferSourceNode", () => {
        expect(source instanceof AudioBufferSourceNode).toBe(true);
    });

    it("doesn't barf when load is called 1000 times", (done) => {
        const sample = _.map(new Array(1000), () => sound.load());
        Promise.all(sample).then(() => {
            done();
        }).catch(err => done.fail(err));
    });

    it ("doesn't barf when play is called 1000 times", (done) => {
        const sample = _.map(new Array(1000), () => sound.play());
        Promise.all(sample).then(() => {
            done();
        }).catch(err => done.fail(err));
    });

    it ("doesn't barf when stop is called 1000 times", (done) => {
        const sample = _.map(new Array(1000), () => sound.stop());
        Promise.all(sample).then(() => {
            done();
        }).catch(err => done.fail(err));
    });


});