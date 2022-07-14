"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("../utils.js");
const guards_js_1 = require("./guards.js");
class Sanitizer {
    constructor(app, options) {
        this.app = app;
        this.masked = new Set();
        this.maskedContainers = new Set();
        this.options = Object.assign({
            obscureTextEmails: true,
            obscureTextNumbers: false,
        }, options);
    }
    handleNode(id, parentID, node) {
        if (this.masked.has(parentID) ||
            ((0, guards_js_1.isElementNode)(node) &&
                (0, utils_js_1.hasOpenreplayAttribute)(node, 'masked'))) {
            this.masked.add(id);
        }
        if (this.maskedContainers.has(parentID) ||
            ((0, guards_js_1.isElementNode)(node) &&
                (0, utils_js_1.hasOpenreplayAttribute)(node, 'htmlmasked'))) {
            this.maskedContainers.add(id);
        }
    }
    sanitize(id, data) {
        if (this.masked.has(id)) {
            // TODO: is it the best place to put trim() ? Might trimmed spaces be considered in layout in certain cases?
            return data.trim().replace(/[^\f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g, '█');
        }
        if (this.options.obscureTextNumbers) {
            data = data.replace(/\d/g, '0');
        }
        if (this.options.obscureTextEmails) {
            data = data.replace(/([^\s]+)@([^\s]+)\.([^\s]+)/g, (...f) => (0, utils_js_1.stars)(f[1]) + '@' + (0, utils_js_1.stars)(f[2]) + '.' + (0, utils_js_1.stars)(f[3]));
        }
        return data;
    }
    isMasked(id) {
        return this.masked.has(id);
    }
    isMaskedContainer(id) {
        return this.maskedContainers.has(id);
    }
    getInnerTextSecure(el) {
        const id = this.app.nodes.getID(el);
        if (!id) {
            return '';
        }
        return this.sanitize(id, el.innerText);
    }
    clear() {
        this.masked.clear();
        this.maskedContainers.clear();
    }
}
exports.default = Sanitizer;
