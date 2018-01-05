'use strict';

const types = new Map();
const DEFAULT_NODE_TYPE = 'unstyled';
const DEFAULT_BASE_COMPONENT = 'root';

function addHandlerForType(type, handler) {
    types.set(type, handler);

    return types;
}

function getHandlerForType(type) {
    return types.get(type) || types.get(DEFAULT_NODE_TYPE);
}

module.exports = {
    DEFAULT_NODE_TYPE,
    DEFAULT_BASE_COMPONENT,
    addHandlerForType,
    getHandlerForType
};
