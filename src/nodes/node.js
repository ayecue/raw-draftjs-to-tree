'use strict';

const AbstractNode = require('./abstract-node');
const deepEqual = require('deep-equal');

function makeOptimizationIterator(children, startIndex = 0) {
    let currentIndex = startIndex > 0 ? startIndex - 1 : startIndex;
    const done = () => ({done: true});
    const next = (node, nextNode, index) => ({
        node,
        nextNode,
        index,
        done: false
    });

    return {
        next: function () {
            if (currentIndex >= children.length - 1) {
                return done();
            }

            const node = children[currentIndex];
            const nextNode = children[currentIndex + 1];

            currentIndex += 1;

            if (node.isEqual(nextNode)) {
                currentIndex -= 1;

                return next(node, nextNode, currentIndex);
            }

            return this.next();
        }
    };
}

class Node extends AbstractNode {
    static createNodeWithStyle(style, children = [], settings) {
        return new Node(style.getType(), style.getRange(), children, style.getData(), settings);
    }

    constructor(type, range, children = [], data = {}, settings) {
        super(type, range, settings);

        this.children = children;
        this.data = data;
    }

    getChild(position) {
        return this.children[position];
    }

    getChildren() {
        return this.children;
    }

    setChildren(children) {
        this.children = children;

        return this;
    }

    getData() {
        return this.data;
    }

    isEqual(node) {
        return super.isEqual(node)
            && deepEqual(node.getData(), this.getData());
    }

    addStyle(style) {
        const range = this.getRange();
        const styleRange = style.getRange();

        if (
            range.isEqual(styleRange)
            || range.isEqualAndOutside(styleRange)
            || range.isOutside(styleRange)
        ) {
            const parent = this.getParent();
            const position = this.getPosition();

            //insert wrapping node
            parent.insert([
                Node.createNodeWithStyle(style)
                    .setRange(range.clone())
                    .insert([this])
            ], position);
        } else if (range.isTouching(styleRange)) {
            const iterator = this.makeAffectedIterator(style);
            let state;

            while (!(state = iterator.next()).done) {
                state.node.addStyle(style);
            }
        }

        return this;
    }

    reindex(start = 0, end) {
        const max = end || this.getChildren().length;
        let index = start;

        while (index < max) {
            const node = this.getChild(index);

            node
                .setPosition(index)
                .setParent(this);

            index += 1;
        }

        return this;
    }

    insert(nodes, position = 0, length = 1) {
        const {OPTIMIZATION_ENABLED} = this.getSettings();
        const children = this.getChildren();
        const before = children.slice(0, position);
        const after = children.slice(position + length, children.length);
        const newChildren = []
            .concat(before)
            .concat(nodes)
            .concat(after);

        if (OPTIMIZATION_ENABLED) {
            const iterator = makeOptimizationIterator(newChildren, position);
            let state;

            while (!(state = iterator.next()).done) {
                const {index, node, nextNode} = state;

                newChildren.splice(index, 2, node.concat(nextNode));
            }
        }

        this
            .setChildren(newChildren)
            .reindex();

        return this;
    }

    concat(node) {
        const range = this.getRange();
        const nodeRange = node.getRange();
        const joinedRange = range.join(nodeRange);
        const children = this.getChildren();
        const nodeChildren = node.getChildren();

        return new Node(
            this.getType(),
            joinedRange,
            children,
            this.getData(),
            this.getSettings()
        ).insert(nodeChildren, children.length, 0);
    }

    makeAffectedIterator(style) {
        const styleRange = style.getRange();
        const children = this.getChildren();
        let currentIndex = children.length;
        let affected = 0;
        const done = () => ({done: true});
        const next = (node, index) => ({
            node,
            index,
            done: false
        });

        return {
            next: function () {
                if (currentIndex === 0) {
                    return done();
                }

                currentIndex -= 1;

                const node = children[currentIndex];
                const range = node.getRange();

                if (range.isAffected(styleRange)) {
                    affected += 1;

                    return next(node, currentIndex);
                } else if (affected > 0) {
                    return done();
                }

                return this.next();
            }
        };
    }

    toJSON() {
        return Object.assign(super.toJSON(), {
            children: this.getChildren().map((child) => (
                child.toJSON()
            )),
            data: this.getData()
        });
    }
}

module.exports = Node;
