'use strict';

const Style = require('./style');
const assert = require('assert');
const {createRange} = require('../ranges');

describe('Style operations', function () {
    const DEFAULT_TYPE = 'test';

    it('should create a style', function () {
        const range = createRange(0, 4);
        const style = new Style(DEFAULT_TYPE, range);

        assert.equal(style.getRange().getOffset(), 0);
        assert.equal(style.getRange().getLength(), 4);
        assert.equal(style.getType(), DEFAULT_TYPE);
        assert.deepEqual(style.getData(), {});
    });
});
