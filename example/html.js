'use strict';

const {
    addHandlerForType,
    getHandlerForType,
    DEFAULT_NODE_TYPE,
    DEFAULT_BASE_COMPONENT
} = require('./html/types-manager');

function convertToHtmlCallback(string, node) {
    return string + treeToHtml(node);
}

function convertToHtml(node) {
    return node.reduce(convertToHtmlCallback, '');
}


function treeToHtml(node) {
    if (!node) {
        return '';
    }

    const type = node.getType() || DEFAULT_NODE_TYPE;
    const handler = getHandlerForType(type);

    return handler(node, convertToHtml);
}

//integrate default types
require('./html/types');

module.exports = {
    addHandlerForType,
    treeToHtml,
    DEFAULT_NODE_TYPE,
    DEFAULT_BASE_COMPONENT
};
