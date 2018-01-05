'use strict';

const {
    addHandlerForType,
    treeToHtml,
    DEFAULT_NODE_TYPE,
    DEFAULT_BASE_COMPONENT
} = require('./html');
const convertToTree = require('../src/index');
const createHtmlFile = require('./create-html-file');
const content = require('../test/mock/draftjsobject.json');
let t0, t1;

/*
Convert raw draftjs object json tree
*/
t0 = new Date().getTime();
const tree = convertToTree(content, {
    DEFAULT_NODE_TYPE,
    DEFAULT_BASE_COMPONENT,
    OPTIMIZATION_ENABLED: false
});
t1 = new Date().getTime();
const conversionToTreeTime = t1 - t0;

/*
Convert json tree to html
*/
t0 = new Date().getTime();
const html = treeToHtml(tree);
t1 = new Date().getTime();
const htmlConversionTime = t1 - t0;

createHtmlFile(html, {
    conversionToTreeTime,
    htmlConversionTime
});
