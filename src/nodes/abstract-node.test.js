'use strict';

const AbstractNode = require('./abstract-node');
const {createRange} = require('../ranges');
const {DEFAULT_NODE_TYPE} = require('../settings')();
const assert = require('assert');

describe('Abstract node operations', function () {
    it('should create a abstract node', function () {
        const range = createRange(0, 4);
        const node = new AbstractNode(DEFAULT_NODE_TYPE, range);

        assert.equal(node.getRange().getOffset(), 0);
        assert.equal(node.getRange().getLength(), 4);
        assert.equal(node.getType(), DEFAULT_NODE_TYPE);
        assert.equal(node.getPosition(), -1);
        assert.equal(node.getParent(), undefined);
    });

    it('should check if abstract node is equal to abstract node', function () {
        const range = createRange(0, 4);
        const node = new AbstractNode(DEFAULT_NODE_TYPE, range);
        const rangeB = createRange(0, 4);
        const nodeB = new AbstractNode(DEFAULT_NODE_TYPE, rangeB);

        assert(node.isEqual(nodeB));
    });

    it('should transform abstract node to JSON', function () {
        const range = createRange(0, 4);
        const node = new AbstractNode(DEFAULT_NODE_TYPE, range);
        const json = node.toJSON();

        assert.equal(json.type, DEFAULT_NODE_TYPE);
        assert.equal(json.range.offset, 0);
        assert.equal(json.range.length, 4);
        assert.deepEqual(json.parent, undefined);
        assert.deepEqual(json.position, -1);
    });
});
