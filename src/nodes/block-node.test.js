'use strict';

const BlockNode = require('./block-node');
const TextNode = require('./text-node');
const {createRange} = require('../ranges');
const {createStyleFromInlineStyle} = require('../styles');
const {DEFAULT_NODE_TYPE} = require('../settings')();
const assert = require('assert');

describe('Node operations', function () {
    const DEFAULT_TEXT = 'test';
    const TEXT_TYPE = 'text';

    function createTextNode(offset = 0, length = 4) {
        const range = createRange(offset, length);
        const textNode = new TextNode(DEFAULT_TEXT, range);

        return textNode;
    }

    function createBlockWithTextNode(offset = 0, length = 4) {
        const range = createRange(offset, length);
        const textNode = createTextNode(offset, length);
        const node = new BlockNode(DEFAULT_NODE_TYPE, range, [], {});

        node.insert([textNode]);

        return {
            node,
            textNode
        };
    }

    it('should create a block node', function () {
        const range = createRange(0, 4);
        const node = new BlockNode(DEFAULT_NODE_TYPE, range);

        assert.equal(node.getRange().getOffset(), 0);
        assert.equal(node.getRange().getLength(), 4);
        assert.equal(node.getType(), DEFAULT_NODE_TYPE);
        assert.equal(node.getPosition(), -1);
        assert.equal(node.getParent(), undefined);
        assert.deepEqual(node.getChildren(), []);
        assert.deepEqual(node.getData(), {});
    });

    it('should add style to block node', function () {
        const {node} = createBlockWithTextNode();
        const style = createStyleFromInlineStyle({
            offset: 1,
            length: 2,
            style: 'test-style'
        });

        node.addStyle(style);

        assert.equal(node.getChild(0).getType(), TEXT_TYPE);
        assert.equal(node.getChild(1).getType(), style.getType());
        assert.equal(
            node
                .getChild(1)
                .getChild(0)
                .getType(),
            TEXT_TYPE
        );
        assert.equal(node.getChild(2).getType(), TEXT_TYPE);
    });

    it('should transform block node to JSON', function () {
        const range = createRange(0, 4);
        const node = new BlockNode(DEFAULT_NODE_TYPE, range);
        const json = node.toJSON();

        assert.equal(json.type, DEFAULT_NODE_TYPE);
        assert.equal(json.range.offset, 0);
        assert.equal(json.range.length, 4);
        assert.deepEqual(json.children, []);
        assert.deepEqual(json.data, {});
    });
});
