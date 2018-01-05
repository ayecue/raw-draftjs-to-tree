'use strict';

const Range = require('./range');
const assert = require('assert');

describe('Range operations', function () {
    it('should create a range', function () {
        const range = new Range(0, 4);

        assert.equal(range.getOffset(), 0);
        assert.equal(range.getLength(), 4);
        assert.equal(range.getEnd(), 4);
        /* eslint-disable */
        assert.throws(() => {
            new Range(0, -1);
        }, Error);
        /* eslint-enable */
    });

    it('should check if range is affected by range', function () {
        const source = new Range(0, 4);
        const target = new Range(1, 2);
        const sourceB = new Range(2, 4);
        const targetB = new Range(1, 1);

        assert(source.isAffected(target));
        assert(sourceB.isAffected(targetB) === false);
    });

    it('should check if range is equal to range', function () {
        const source = new Range(1, 1);
        const target = new Range(1, 1);

        assert(source.isEqual(target));
    });

    it('should check if range is equal and outside range', function () {
        const source = new Range(1, 1);
        const target = new Range(1, 2);
        const sourceB = new Range(1, 1);
        const targetB = new Range(2, 2);

        assert(source.isEqualAndOutside(target));
        assert(sourceB.isEqualAndOutside(targetB) === false);
    });

    it('should check if range is inside range', function () {
        const source = new Range(0, 3);
        const target = new Range(1, 1);
        const sourceB = new Range(0, 3);
        const targetB = new Range(3, 1);

        assert(source.isInside(target));
        assert(sourceB.isInside(targetB) === false);
    });

    it('should check if range is touching range', function () {
        const source = new Range(0, 3);
        const target = new Range(2, 3);
        const sourceB = new Range(0, 3);
        const targetB = new Range(3, 3);

        assert(source.isTouching(target));
        assert(sourceB.isTouching(targetB) === false);
    });

    it('should check if range is wrapping range from left', function () {
        const source = new Range(2, 3);
        const target = new Range(0, 3);

        assert(source.isWrappingLeft(target));
    });

    it('should check if range is wrapping range from right', function () {
        const source = new Range(0, 3);
        const target = new Range(2, 3);

        assert(source.isWrappingRight(target));
    });

    it('should check if range is outside of range', function () {
        const source = new Range(1, 3);
        const target = new Range(0, 5);

        assert(source.isOutside(target));
    });

    it('should ckeck if range wraps range', function () {
        const sourceA = new Range(1, 3);
        const targetA = new Range(0, 5);
        const sourceB = new Range(0, 3);
        const targetB = new Range(2, 3);
        const sourceC = new Range(2, 3);
        const targetC = new Range(0, 3);

        assert(sourceA.isWrapping(targetA));
        assert(sourceB.isWrapping(targetB));
        assert(sourceC.isWrapping(targetC));
    });

    it('should be empty range', function () {
        const range = new Range(0, 0);

        assert(range.isEmpty());
    });

    it('should check is range is connecting to other range', function () {
        const source = new Range(0, 3);
        const target = new Range(3, 3);

        assert(source.isConnectingTo(target));
    });

    it('should join range with other range', function () {
        const source = new Range(0, 3);
        const target = new Range(3, 3);
        const joinedRange = source.join(target);

        assert.equal(joinedRange.getOffset(), 0);
        assert.equal(joinedRange.getLength(), 6);
    });

    it('should cut range', function () {
        const source = new Range(0, 3);
        const target = new Range(1, 1);
        const cuttedRanges = source.cut(target);
        const before = cuttedRanges.shift().range;
        const body = cuttedRanges.shift().range;
        const after = cuttedRanges.shift().range;

        assert.equal(before.getOffset(), 0);
        assert.equal(before.getLength(), 1);
        assert.equal(body.getOffset(), 1);
        assert.equal(body.getLength(), 1);
        assert.equal(after.getOffset(), 2);
        assert.equal(after.getLength(), 1);
    });

    it('should transform range to JSON', function () {
        const source = new Range(0, 3);
        const rawSource = source.toJSON();

        assert.equal(rawSource.offset, 0);
        assert.equal(rawSource.length, 3);
    });

    it('should clone range', function () {
        const source = new Range(0, 3);
        const cloned = source.clone();

        assert.equal(cloned.getOffset(), 0);
        assert.equal(cloned.getLength(), 3);
    });
});
