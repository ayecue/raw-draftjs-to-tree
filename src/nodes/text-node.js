'use strict';

const AbstractNode = require('./abstract-node');
const Node = require('./node');

const TEXT_NODE_TYPE = 'text';

class TextNode extends AbstractNode {
    constructor(text, range, settings) {
        super(TEXT_NODE_TYPE, range, settings);
        this.text = text;
    }

    getText() {
        return this.text;
    }

    addStyle(style) {
        const range = this.getRange();
        const styleRange = style.getRange();

        if (
            range.isEqual(styleRange)
            || range.isInside(styleRange)
            || range.isTouching(styleRange)
        ) {
            const parent = this.getParent();
            const position = this.getPosition();

            if (parent === undefined) {
                throw new Error('No parent assigned. Needs to have at least a block node as parent.');
            }

            parent.insert(range.cut(styleRange).map((item) => {
                const splitted = this.cut(item.range);

                if (item.description === 'body') {
                    return Node.createNodeWithStyle(style)
                        .setRange(item.range)
                        .insert([splitted]);
                }

                return splitted;
            }), position);
        } else if (range.isWrapping(styleRange)) {
            throw new Error('Cannot apply style on TextNode which is outside of range.');
        }

        return this;
    }

    concat(textNode) {
        const range = this.getRange();
        const nodeRange = textNode.getRange();
        const joinedRange = range.join(nodeRange);
        const text = this.getText();
        const nodeText = textNode.getText();

        return new TextNode(
            text + nodeText,
            joinedRange,
            this.getSettings()
        );
    }

    cut(newRange) {
        const range = this.getRange();
        const positionStart = range.getOffset();
        const newRangeStart = newRange.getOffset();
        const newRangeEnd = newRange.getEnd();
        const stringStart = newRangeStart - positionStart;
        const stringStop = newRangeEnd - positionStart;
        const newText = this.getText().substring(stringStart, stringStop);

        return new TextNode(
            newText,
            newRange,
            this.getSettings()
        );
    }

    toJSON() {
        return Object.assign(super.toJSON(), {
            text: this.getText()
        });
    }
}

module.exports = TextNode;
