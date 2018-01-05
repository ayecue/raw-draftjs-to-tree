'use strict';

const {createRange} = require('./ranges');
const Style = require('./styles/style');

function createStyleFromEntityRange(entityRange, entityMap) {
    const {type, data} = entityMap[entityRange.key];
    const range = createRange(entityRange.offset, entityRange.length);

    return new Style(type, range, data);
}

function createStyleFromInlineStyle(inlineStyle) {
    const type = inlineStyle.style;
    const range = createRange(inlineStyle.offset, inlineStyle.length);

    return new Style(type, range);
}

module.exports = {
    createStyleFromEntityRange,
    createStyleFromInlineStyle
};
