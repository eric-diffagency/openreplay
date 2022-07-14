"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOpenreplayAttribute = exports.getLabelAttribute = exports.deprecationWarn = exports.DOCS_HOST = exports.IN_BROWSER = exports.isURL = exports.normSpaces = exports.stars = exports.timestamp = void 0;
function timestamp() {
    return Math.round(performance.now()) + performance.timing.navigationStart;
}
exports.timestamp = timestamp;
exports.stars = 'repeat' in String.prototype
    ? (str) => '*'.repeat(str.length)
    : (str) => str.replace(/./g, '*');
function normSpaces(str) {
    return str.trim().replace(/\s+/g, ' ');
}
exports.normSpaces = normSpaces;
// isAbsoluteUrl regexp:  /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
function isURL(s) {
    return s.startsWith('https://') || s.startsWith('http://');
}
exports.isURL = isURL;
exports.IN_BROWSER = !(typeof window === "undefined");
// TODO: JOIN IT WITH LOGGER somehow (use logging decorators?); Don't forget about index.js loggin when there is no logger instance.
exports.DOCS_HOST = 'https://docs.openreplay.com';
const warnedFeatures = {};
function deprecationWarn(nameOfFeature, useInstead, docsPath = "/") {
    if (warnedFeatures[nameOfFeature]) {
        return;
    }
    console.warn(`OpenReplay: ${nameOfFeature} is deprecated. ${useInstead ? `Please, use ${useInstead} instead.` : ""} Visit ${exports.DOCS_HOST}${docsPath} for more information.`);
    warnedFeatures[nameOfFeature] = true;
}
exports.deprecationWarn = deprecationWarn;
function getLabelAttribute(e) {
    let value = e.getAttribute("data-openreplay-label");
    if (value !== null) {
        return value;
    }
    value = e.getAttribute("data-asayer-label");
    if (value !== null) {
        deprecationWarn(`"data-asayer-label" attribute`, `"data-openreplay-label" attribute`, "/");
    }
    return value;
}
exports.getLabelAttribute = getLabelAttribute;
function hasOpenreplayAttribute(e, name) {
    const newName = `data-openreplay-${name}`;
    if (e.hasAttribute(newName)) {
        return true;
    }
    const oldName = `data-asayer-${name}`;
    if (e.hasAttribute(oldName)) {
        deprecationWarn(`"${oldName}" attribute`, `"${newName}" attribute`, "/installation/sanitize-data");
        return true;
    }
    return false;
}
exports.hasOpenreplayAttribute = hasOpenreplayAttribute;
