'use strict';

function applyStyles(blockNode, styles) {
    return styles
        .reduce((node, style) => node.addStyle(style), blockNode);
}

module.exports = applyStyles;
