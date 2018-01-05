'use strict';

const {
    createStyleFromEntityRange,
    createStyleFromInlineStyle
} = require('./styles');
const {
    createTextNodeWithBlock,
    createRootNode
} = require('./nodes');
const applyStyles = require('./processing');
const createSettings = require('./settings');

function convertFromRawToTree(rawContentState, customSettings) {
    const {blocks, entityMap} = rawContentState;
    const settings = createSettings(customSettings);
    const rootNode = createRootNode(settings);
    const children = blocks.map((block, index) => {
        const {entityRanges, inlineStyleRanges} = block;
        const item = createTextNodeWithBlock(block, settings)
            .setPosition(index)
            .setParent(rootNode);
        const entityStyles = entityRanges.map((entityRange) => (
            createStyleFromEntityRange(entityRange, entityMap)
        ));
        const styles = inlineStyleRanges
            .map(createStyleFromInlineStyle)
            .concat(entityStyles);

        if (styles.length === 0) {
            return item;
        }

        return applyStyles(item, styles);
    });

    return rootNode
        .setChildren(children);
}

module.exports = convertFromRawToTree;
