export function isSVGElement(node) {
    return node.namespaceURI === 'http://www.w3.org/2000/svg';
}
export function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
export function isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
}
export function isRootNode(node) {
    return node.nodeType === Node.DOCUMENT_NODE ||
        node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
export function hasTag(el, tagName) {
    return el.nodeName === tagName;
}
