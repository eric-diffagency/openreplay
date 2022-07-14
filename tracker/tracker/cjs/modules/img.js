"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("../utils.js");
const messages_js_1 = require("../common/messages.js");
const guards_js_1 = require("../app/guards.js");
function resolveURL(url, location = document.location) {
    url = url.trim();
    if (url.startsWith('/')) {
        return location.origin + url;
    }
    else if (url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('data:') // any other possible value here?
    ) {
        return url;
    }
    else {
        return location.origin + location.pathname + url;
    }
}
const PLACEHOLDER_SRC = "https://static.openreplay.com/tracker/placeholder.jpeg";
function default_1(app) {
    function sendPlaceholder(id, node) {
        app.send(new messages_js_1.SetNodeAttribute(id, "src", PLACEHOLDER_SRC));
        const { width, height } = node.getBoundingClientRect();
        if (!node.hasAttribute("width")) {
            app.send(new messages_js_1.SetNodeAttribute(id, "width", String(width)));
        }
        if (!node.hasAttribute("height")) {
            app.send(new messages_js_1.SetNodeAttribute(id, "height", String(height)));
        }
    }
    const sendImgSrc = app.safe(function () {
        const id = app.nodes.getID(this);
        if (id === undefined) {
            return;
        }
        const { src, complete, naturalWidth, naturalHeight, srcset } = this;
        if (!complete) {
            return;
        }
        const resolvedSrc = resolveURL(src || ''); // Src type is null sometimes. - is it true?
        if (naturalWidth === 0 && naturalHeight === 0) {
            if ((0, utils_js_1.isURL)(resolvedSrc)) {
                app.send(new messages_js_1.ResourceTiming((0, utils_js_1.timestamp)(), 0, 0, 0, 0, 0, resolvedSrc, 'img'));
            }
        }
        else if (resolvedSrc.length >= 1e5 || app.sanitizer.isMasked(id)) {
            sendPlaceholder(id, this);
        }
        else {
            app.send(new messages_js_1.SetNodeAttribute(id, 'src', resolvedSrc));
            if (srcset) {
                const resolvedSrcset = srcset.split(',').map(str => resolveURL(str)).join(',');
                app.send(new messages_js_1.SetNodeAttribute(id, 'srcset', resolvedSrcset));
            }
        }
    });
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "attributes") {
                const target = mutation.target;
                const id = app.nodes.getID(target);
                if (id === undefined) {
                    return;
                }
                if (mutation.attributeName === "src") {
                    const src = target.src;
                    app.send(new messages_js_1.SetNodeAttributeURLBased(id, 'src', src, app.getBaseHref()));
                }
                if (mutation.attributeName === "srcset") {
                    const srcset = target.srcset;
                    app.send(new messages_js_1.SetNodeAttribute(id, 'srcset', srcset));
                }
            }
        }
    });
    app.nodes.attachNodeCallback((node) => {
        if (!(0, guards_js_1.hasTag)(node, "IMG")) {
            return;
        }
        app.nodes.attachElementListener('error', node, sendImgSrc);
        app.nodes.attachElementListener('load', node, sendImgSrc);
        sendImgSrc.call(node);
        observer.observe(node, { attributes: true, attributeFilter: ["src", "srcset"] });
    });
}
exports.default = default_1;
