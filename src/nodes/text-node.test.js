'use strict';

const BlockNode = require('./block-node');
const TextNode = require('./text-node');
const {createRange} = require('../ranges');
const {createStyleFromInlineStyle} = require('../styles');
const {DEFAULT_NODE_TYPE} = require('../settings')();
const assert = require('assert');

describe('TextNode operations', function () {
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

    it('should create a TextNode', function () {
        const range = createRange(0, 4);
        const textNode = new TextNode(DEFAULT_TEXT, range);

        assert.equal(textNode.getRange().getOffset(), 0);
        assert.equal(textNode.getRange().getLength(), 4);
        assert.equal(textNode.getType(), TEXT_TYPE);
        assert.equal(textNode.getText(), DEFAULT_TEXT);
    });

    it('should add style to TextNode to middle', function () {
        const {node, textNode} = createBlockWithTextNode();
        const style = createStyleFromInlineStyle({
            offset: 1,
            length: 2,
            style: 'test-style'
        });

        textNode.addStyle(style);

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

    it('should add style to TextNode to beginning', function () {
        const {node, textNode} = createBlockWithTextNode();
        const style = createStyleFromInlineStyle({
            offset: 0,
            length: 2,
            style: 'test-style'
        });

        textNode.addStyle(style);

        assert.equal(node.getChild(0).getType(), style.getType());
        assert.equal(
            node
                .getChild(0)
                .getChild(0)
                .getType(),
            TEXT_TYPE
        );
        assert.equal(node.getChild(1).getType(), TEXT_TYPE);
    });

    it('should add style to TextNode to end', function () {
        const {node, textNode} = createBlockWithTextNode();
        const style = createStyleFromInlineStyle({
            offset: 2,
            length: 2,
            style: 'test-style'
        });

        textNode.addStyle(style);

        assert.equal(node.getChild(0).getType(), TEXT_TYPE);
        assert.equal(node.getChild(1).getType(), style.getType());
        assert.equal(
            node
                .getChild(1)
                .getChild(0)
                .getType(),
            TEXT_TYPE
        );
    });

    it('should concat two text nodes together', function () {
        const textNode = createTextNode();
        const textNodeB = createTextNode(4);
        const concatedNode = textNode.concat(textNodeB);

        assert.equal(concatedNode.getText(), DEFAULT_TEXT + DEFAULT_TEXT);
    });

    it('should cut new text node out of existing', function () {
        const textNode = createTextNode();
        const rangeToCut = createRange(1, 2);
        const cuttedTextNode = textNode.cut(rangeToCut);

        assert.equal(cuttedTextNode.getText(), DEFAULT_TEXT.substr(1, 2));
    });

    it('should transform text node to JSON', function () {
        const textNode = createTextNode();
        const json = textNode.toJSON();

        assert.equal(json.type, TEXT_TYPE);
        assert.equal(json.text, DEFAULT_TEXT);
        assert.equal(json.range.offset, 0);
        assert.equal(json.range.length, 4);
        assert.equal(json.position, -1);
        assert.equal(json.parent, undefined);
    });
});
