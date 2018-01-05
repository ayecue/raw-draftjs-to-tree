'use strict';

const Node = require('./node');

class RootNode extends Node {
    constructor(type, children) {
        super(type, undefined, children);
    }

    /* eslint-disable */
    setParent() {
        throw new Error('Cannot set parent in BlockNode.');
    }
    /* eslint-enable */

    /* eslint-disable */
    addStyle(style) {
        throw new Error('Cannot apply style to root.');
    }
    /* eslint-enable */

    toJSON() {
        return {
            type: this.getType(),
            children: this.getChildren().map((child) => (
                child.toJSON()
            ))
        };
    }
}

module.exports = RootNode;
