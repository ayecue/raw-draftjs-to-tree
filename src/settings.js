'use strict';

const DEFAULT_SETTINGS = {
    OPTIMIZATION_ENABLED: true,
    DEFAULT_NODE_TYPE: 'unstyled',
    DEFAULT_BASE_COMPONENT: 'root'
};

function createSettings(settings) {
    return Object.assign({}, DEFAULT_SETTINGS, settings);
}

module.exports = createSettings;
