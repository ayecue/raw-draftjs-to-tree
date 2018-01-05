'use strict';

const RootNode = require('./root-node');
const {DEFAULT_BASE_COMPONENT} = require('../settings')();
const assert = require('assert');

describe('RootNode operations', function () {
    it('should create a block node', function () {
        const node = new RootNode(DEFAULT_BASE_COMPONENT);

        assert.equal(node.getType(), DEFAULT_BASE_COMPONENT);
        assert.deepEqual(node.getChildren(), []);
    });

    it('should fail to set parent', function () {
        const node = new RootNode(DEFAULT_BASE_COMPONENT);

        assert.throws(() => {
            node.setParent();
        }, Error);
    });

    it('should fail to add style', function () {
        const node = new RootNode(DEFAULT_BASE_COMPONENT);

        assert.throws(() => {
            node.addStyle();
        }, Error);
    });

    it('should transform block node to JSON', function () {
        const node = new RootNode(DEFAULT_BASE_COMPONENT);
        const json = node.toJSON();

        assert.equal(json.type, DEFAULT_BASE_COMPONENT);
        assert.deepEqual(json.children, []);
    });
});
