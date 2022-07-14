"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guards_js_1 = require("../app/guards.js");
const utils_js_1 = require("../utils.js");
const messages_js_1 = require("../common/messages.js");
const input_js_1 = require("./input.js");
function _getSelector(target) {
    let el = target;
    let selector = null;
    do {
        if (el.id) {
            return `#${el.id}` + (selector ? ` > ${selector}` : '');
        }
        selector =
            el.className.split(' ')
                .map(cn => cn.trim())
                .filter(cn => cn !== '')
                .reduce((sel, cn) => `${sel}.${cn}`, el.tagName.toLowerCase()) +
                (selector ? ` > ${selector}` : '');
        if (el === document.body) {
            return selector;
        }
        el = el.parentElement;
    } while (el !== document.body && el !== null);
    return selector;
}
function isClickable(element) {
    const tag = element.tagName.toUpperCase();
    return tag === 'BUTTON' ||
        tag === 'A' ||
        tag === 'LI' ||
        tag === 'SELECT' ||
        element.onclick != null ||
        element.getAttribute('role') === 'button';
    //|| element.className.includes("btn")
    // MBTODO: intersect addEventListener
}
//TODO: fix (typescript doesn't allow work when the guard is inside the function)
function getTarget(target) {
    if (target instanceof Element) {
        return _getTarget(target);
    }
    return null;
}
function _getTarget(target) {
    let element = target;
    while (element !== null && element !== document.documentElement) {
        if ((0, utils_js_1.hasOpenreplayAttribute)(element, 'masked')) {
            return null;
        }
        element = element.parentElement;
    }
    if ((0, guards_js_1.isSVGElement)(target)) {
        let owner = target.ownerSVGElement;
        while (owner !== null) {
            target = owner;
            owner = owner.ownerSVGElement;
        }
    }
    element = target;
    while (element !== null && element !== document.documentElement) {
        const tag = element.tagName.toUpperCase();
        if (tag === 'LABEL') {
            return null;
        }
        if (tag === 'INPUT') {
            return element;
        }
        if (isClickable(element) ||
            (0, utils_js_1.getLabelAttribute)(element) !== null) {
            return element;
        }
        element = element.parentElement;
    }
    return target === document.documentElement ? null : target;
}
function default_1(app) {
    function getTargetLabel(target) {
        const dl = (0, utils_js_1.getLabelAttribute)(target);
        if (dl !== null) {
            return dl;
        }
        if ((0, guards_js_1.hasTag)(target, "INPUT")) {
            return (0, input_js_1.getInputLabel)(target);
        }
        if (isClickable(target)) {
            let label = '';
            if (target instanceof HTMLElement) {
                label = app.sanitizer.getInnerTextSecure(target);
            }
            label = label || target.id || target.className;
            return (0, utils_js_1.normSpaces)(label).slice(0, 100);
        }
        return '';
    }
    let mousePositionX = -1;
    let mousePositionY = -1;
    let mousePositionChanged = false;
    let mouseTarget = null;
    let mouseTargetTime = 0;
    app.attachStopCallback(() => {
        mousePositionX = -1;
        mousePositionY = -1;
        mousePositionChanged = false;
        mouseTarget = null;
    });
    const sendMouseMove = () => {
        if (mousePositionChanged) {
            app.send(new messages_js_1.MouseMove(mousePositionX, mousePositionY));
            mousePositionChanged = false;
        }
    };
    const selectorMap = {};
    function getSelector(id, target) {
        return selectorMap[id] = selectorMap[id] || _getSelector(target);
    }
    app.attachEventListener(document.documentElement, 'mouseover', (e) => {
        const target = getTarget(e.target);
        if (target !== mouseTarget) {
            mouseTarget = target;
            mouseTargetTime = performance.now();
        }
    });
    app.attachEventListener(document, 'mousemove', (e) => {
        mousePositionX = e.clientX;
        mousePositionY = e.clientY;
        mousePositionChanged = true;
    }, false);
    app.attachEventListener(document, 'click', (e) => {
        const target = getTarget(e.target);
        if ((!e.clientX && !e.clientY) || target === null) {
            return;
        }
        const id = app.nodes.getID(target);
        if (id !== undefined) {
            sendMouseMove();
            app.send(new messages_js_1.MouseClick(id, mouseTarget === target
                ? Math.round(performance.now() - mouseTargetTime)
                : 0, getTargetLabel(target), getSelector(id, target)), true);
        }
        mouseTarget = null;
    });
    app.ticker.attach(sendMouseMove, 10);
}
exports.default = default_1;
