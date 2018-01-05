'use strict';

const Node = require('./node');

class BlockNode extends Node {
    addStyle(style) {
        const iterator = this.makeAffectedIterator(style);
        let state;

        while (!(state = iterator.next()).done) {
            state.node.addStyle(style);
        }

        return this;
    }

    toJSON() {
        return {
            type: this.getType(),
            range: this.getRange().toJSON(),
            children: this.getChildren().map((child) => (
                child.toJSON()
            )),
            data: this.getData()
        };
    }
}

module.exports = BlockNode;
