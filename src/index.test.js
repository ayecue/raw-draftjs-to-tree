'use strict';

const convertFromRawToTree = require('./index');
const assert = require('assert');
const draftJSObject = require('../test/mock/draftjsobject.json');
const mockTree = require('../test/mock/tree.json');

describe('Main operations', function () {
    it('should convert draftjs object to tree', function () {
        const tree = convertFromRawToTree(draftJSObject).toJSON();

        assert.deepEqual(mockTree, tree);
    });
});
