export function timestamp() {
    return Math.round(performance.now()) + performance.timing.navigationStart;
}
export const stars = 'repeat' in String.prototype
    ? (str) => '*'.repeat(str.length)
    : (str) => str.replace(/./g, '*');
export function normSpaces(str) {
    return str.trim().replace(/\s+/g, ' ');
}
// isAbsoluteUrl regexp:  /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
export function isURL(s) {
    return s.startsWith('https://') || s.startsWith('http://');
}
export const IN_BROWSER = !(typeof window === "undefined");
// TODO: JOIN IT WITH LOGGER somehow (use logging decorators?); Don't forget about index.js loggin when there is no logger instance.
export const DOCS_HOST = 'https://docs.openreplay.com';
const warnedFeatures = {};
export function deprecationWarn(nameOfFeature, useInstead, docsPath = "/") {
    if (warnedFeatures[nameOfFeature]) {
        return;
    }
    console.warn(`OpenReplay: ${nameOfFeature} is deprecated. ${useInstead ? `Please, use ${useInstead} instead.` : ""} Visit ${DOCS_HOST}${docsPath} for more information.`);
    warnedFeatures[nameOfFeature] = true;
}
export function getLabelAttribute(e) {
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
export function hasOpenreplayAttribute(e, name) {
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
