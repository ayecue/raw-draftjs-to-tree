'use strict';

const Range = require('./ranges/range');

function createRange(offset, length) {
    return new Range(offset, length);
}

function createRangeFromText(text) {
    return createRange(0, text.length);
}

module.exports = {
    createRange,
    createRangeFromText
};
