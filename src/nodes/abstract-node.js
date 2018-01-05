'use strict';

class AbstractNode {
    constructor(type, range, settings = {}) {
        this.type = type;
        this.range = range;
        this.settings = settings;
        this.parent = undefined;
        this.position = -1;
    }

    getSettings() {
        return this.settings;
    }

    getType() {
        return this.type;
    }

    getRange() {
        return this.range;
    }

    setRange(range) {
        this.range = range;

        return this;
    }

    getParent() {
        return this.parent;
    }

    setParent(parent) {
        this.parent = parent;

        return this;
    }

    getPosition() {
        return this.position;
    }

    setPosition(position) {
        this.position = parseInt(position);

        return this;
    }

    isEqual(node) {
        return this.getType() === node.getType();
    }

    /* eslint-disable */
    addStyle() {
        throw new Error('Method addStyle is undefined.');
    }
    /* eslint-enable */

    toJSON() {
        return {
            type: this.getType(),
            range: this.getRange().toJSON(),
            position: this.getPosition()
        };
    }
}

module.exports = AbstractNode;
