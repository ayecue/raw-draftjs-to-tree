'use strict';

const {createRangeFromText} = require('./ranges');
const Node = require('./nodes/node');
const TextNode = require('./nodes/text-node');
const BlockNode = require('./nodes/block-node');
const RootNode = require('./nodes/root-node');

function createNode(type, range, children = [], data = {}, settings) {
    return new Node(type, range, children, data, settings);
}

function createTextNode(text, range, settings) {
    return new TextNode(text, range, settings);
}

function createBlockNode(type, range, children = [], data = {}, settings) {
    const {DEFAULT_NODE_TYPE} = settings;

    return new BlockNode(type || DEFAULT_NODE_TYPE, range, children, data, settings);
}

function createRootNode(settings) {
    const {DEFAULT_BASE_COMPONENT} = settings;

    return new RootNode(DEFAULT_BASE_COMPONENT);
}

function createTextNodeWithBlock(block, settings) {
    const {text, type} = block;
    const range = createRangeFromText(text);
    const textNode = createTextNode(text, range, settings);
    const node = createBlockNode(type, range, [], block.data, settings);

    node.insert([textNode]);

    return node;
}

module.exports = {
    createNode,
    createTextNode,
    createBlockNode,
    createRootNode,
    createTextNodeWithBlock
};
