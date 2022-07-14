"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTag = exports.isRootNode = exports.isTextNode = exports.isElementNode = exports.isSVGElement = void 0;
function isSVGElement(node) {
    return node.namespaceURI === 'http://www.w3.org/2000/svg';
}
exports.isSVGElement = isSVGElement;
function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
exports.isElementNode = isElementNode;
function isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
}
exports.isTextNode = isTextNode;
function isRootNode(node) {
    return node.nodeType === Node.DOCUMENT_NODE ||
        node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
exports.isRootNode = isRootNode;
function hasTag(el, tagName) {
    return el.nodeName === tagName;
}
exports.hasTag = hasTag;
