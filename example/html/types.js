'use strict';

const {addHandlerForType} = require('./types-manager');

//utitlity
function isTypeNotEqualWithPreviousNode(node) {
    const parent = node.getParent();
    const before = parent.getChild(node.getPosition() - 1);

    return before === undefined || before.getType() !== node.getType();
}

function isTypeNotEqualWithNextNode(node) {
    const parent = node.getParent();
    const after = parent.getChild(node.getPosition() + 1);

    return after === undefined || after.getType() !== node.getType();
}

//default types
addHandlerForType('header-one', (node, next) => (
    `<h1 class="z-jarvis-rt-text_l">${next(node.getChildren())}</h1>`
));

addHandlerForType('header-two', (node, next) => (
    `<h2 class="z-jarvis-rt-text_m">${next(node.getChildren())}</h2>`
));

addHandlerForType('header-three', (node, next) => (
    `<h3 class="z-jarvis-rt-text_s">${next(node.getChildren())}</h3>`
));

addHandlerForType('BOLD', (node, next) => (
    `<strong class="z-jarvis-rt-bold">${next(node.getChildren())}</strong>`
));

addHandlerForType('ITALIC', (node, next) => (
    `<i class="z-jarvis-rt-italic">${next(node.getChildren())}</i>`
));

addHandlerForType('UNDERLINE', (node, next) => (
    `<u class="z-jarvis-rt-underline">${next(node.getChildren())}</u>`
));

addHandlerForType('LINK', (node, next) => (
    `<a href="${node.data.url}">${next(node.getChildren())}</a>`
));

addHandlerForType('MAILTO', (node, next) => (
    `<a href="${node.data.url}">${next(node.getChildren())}</a>`
));

addHandlerForType('FILE', (node, next) => (
    `<a href="${node.data.url}">${next(node.getChildren())}</a>`
));

addHandlerForType('IMAGE', (node) => {
    const {src, alt} = node.getData();

    return `<img src="${src}" alt="${(alt || '')}"/>`;
});

addHandlerForType('root', (node, next) => (
    `<div class="z-jarvis-rt-text-root">${next(node.getChildren())}</div>`
));

addHandlerForType('unstyled', (node, next) => (
    `<p class="z-jarvis-rt-text">${next(node.getChildren())}</p>`
));

addHandlerForType('ordered-list-item', (node, next) => {
    const prefix = isTypeNotEqualWithPreviousNode(node) ? '<ol>' : '';
    const suffix = isTypeNotEqualWithNextNode(node) ? '</ol>' : '';

    return `${prefix}<li>${next(node.getChildren())}</li>${suffix}`;
});

addHandlerForType('unordered-list-item', (node, next) => {
    const prefix = isTypeNotEqualWithPreviousNode(node) ? '<ul>' : '';
    const suffix = isTypeNotEqualWithNextNode(node) ? '</ul>' : '';

    return `${prefix}<li>${next(node.getChildren())}</li>${suffix}`;
});

addHandlerForType('text', (node) => (
    node.getText()
));
