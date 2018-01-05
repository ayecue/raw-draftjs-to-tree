'use strict';

const BlockNode = require('./block-node');
const TextNode = require('./text-node');
const Node = require('./node');
const {createRange} = require('../ranges');
const {createStyleFromInlineStyle} = require('../styles');
const {DEFAULT_NODE_TYPE} = require('../settings')();
const assert = require('assert');

describe('Node operations', function () {
    const DEFAULT_TYPE = 'test1';
    const DEFAULT_ALT_TYPE = 'test3';
    const DEFAULT_TEXT = 'test';

    function createTextNode(offset, length) {
        const range = createRange(offset, length);
        const textNode = new TextNode(DEFAULT_TEXT, range);

        return textNode;
    }

    function spawnChildren(start, end) {
        let index = start;
        const result = [];

        while (index < end) {
            const range = createRange(index, 1);
            const node = new Node(`testing-node${index}`, range);

            result.push(node);
            index += 1;
        }

        return result;
    }

    function spawnTestingStyles(start, end) {
        let index = start;
        const result = [];

        while (index < end) {
            const style = createStyleFromInlineStyle({
                offset: index,
                length: 1,
                style: `testing-style${index}`
            });

            result.push(style);
            index += 1;
        }

        return result;
    }

    function createBaseBlock() {
        const offset = 0;
        const length = 4;
        const range = createRange(offset, length);
        const textNode = createTextNode(offset, length);
        const node = new BlockNode(DEFAULT_NODE_TYPE, range, [], {});
        const styles = spawnTestingStyles(offset, length);

        node.insert([textNode]);
        styles.forEach((style) => {
            node.addStyle(style);
        });

        return {
            node,
            textNode,
            wrappingNode: node.getChild(0)
        };
    }

    it('should create a Node', function () {
        const range = createRange(0, 4);
        const node = new Node(DEFAULT_TYPE, range);

        assert.equal(node.getRange().getOffset(), 0);
        assert.equal(node.getRange().getLength(), 4);
        assert.equal(node.getType(), DEFAULT_TYPE);
        assert.equal(node.getPosition(), -1);
        assert.equal(node.getParent(), undefined);
        assert.deepEqual(node.getChildren(), []);
        assert.deepEqual(node.getData(), {});
    });

    it('should check if node is equal to node', function () {
        const range = createRange(0, 4);
        const node = new Node(DEFAULT_TYPE, range);
        const rangeB = createRange(0, 4);
        const nodeB = new Node(DEFAULT_TYPE, rangeB);

        assert(node.isEqual(nodeB));
    });

    it('should add style to node', function () {
        const {node} = createBaseBlock();
        const style = createStyleFromInlineStyle({
            offset: 1,
            length: 1,
            style: DEFAULT_TYPE
        });

        node.addStyle(style);

        assert.equal(node.getChild(0).getType(), 'testing-style0');
        assert.equal(node.getChild(1).getType(), DEFAULT_TYPE);
        assert.equal(
            node
                .getChild(1)
                .getChild(0)
                .getType(),
            'testing-style1'
        );
        assert.equal(node.getChild(2).getType(), 'testing-style2');
        assert.equal(node.getChild(3).getType(), 'testing-style3');
    });

    it('should insert node to children of node', function () {
        const range = createRange(0, 4);
        const insertRange = createRange(1, 1);
        const node = new Node(DEFAULT_TYPE, range, spawnChildren(0, 4));
        const insertNode = new Node(DEFAULT_ALT_TYPE, insertRange);

        node.insert([insertNode], 1);

        assert.equal(node.getChild(0).getType(), 'testing-node0');
        assert.equal(node.getChild(1).getType(), DEFAULT_ALT_TYPE);
        assert.equal(node.getChild(2).getType(), 'testing-node2');
        assert.equal(node.getChild(3).getType(), 'testing-node3');
    });

    it('should merge node with node', function () {
        const range = createRange(0, 4);
        const rangeB = createRange(4, 4);
        const node = new Node(DEFAULT_TYPE, range, spawnChildren(0, 4));
        const nodeB = new Node(DEFAULT_ALT_TYPE, rangeB, spawnChildren(4, 8));
        const merged = node.concat(nodeB);

        assert.equal(merged.getChild(0).getType(), 'testing-node0');
        assert.equal(merged.getChild(1).getType(), 'testing-node1');
        assert.equal(merged.getChild(2).getType(), 'testing-node2');
        assert.equal(merged.getChild(3).getType(), 'testing-node3');
        assert.equal(merged.getChild(4).getType(), 'testing-node4');
        assert.equal(merged.getChild(5).getType(), 'testing-node5');
        assert.equal(merged.getChild(6).getType(), 'testing-node6');
        assert.equal(merged.getChild(7).getType(), 'testing-node7');
    });

    it('should create iterator to iterate through affected children nodes by style', function () {
        const range = createRange(0, 4);
        const node = new Node(DEFAULT_TYPE, range, spawnChildren(0, 4));
        const style = createStyleFromInlineStyle({
            offset: 0,
            length: 2,
            style: 'testing-style'
        });
        const iterator = node.makeAffectedIterator(style);
        let state;
        let index = 0;

        while (!(state = iterator.next()).done) {
            assert.equal(state.node.getType(), `testing-node${state.index}`);

            index += 1;
        }

        assert.equal(index, 2);
    });

    it('should transform node to JSON', function () {
        const range = createRange(0, 4);
        const node = new Node(DEFAULT_TYPE, range);
        const json = node.toJSON();

        assert.equal(json.type, DEFAULT_TYPE);
        assert.equal(json.range.offset, 0);
        assert.equal(json.range.length, 4);
        assert.equal(json.position, -1);
        assert.equal(json.parent, undefined);
        assert.deepEqual(json.children, []);
        assert.deepEqual(json.data, {});
    });
});
