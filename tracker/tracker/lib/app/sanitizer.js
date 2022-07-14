import { stars, hasOpenreplayAttribute } from "../utils.js";
import { isElementNode } from "./guards.js";
export default class Sanitizer {
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
            (isElementNode(node) &&
                hasOpenreplayAttribute(node, 'masked'))) {
            this.masked.add(id);
        }
        if (this.maskedContainers.has(parentID) ||
            (isElementNode(node) &&
                hasOpenreplayAttribute(node, 'htmlmasked'))) {
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
            data = data.replace(/([^\s]+)@([^\s]+)\.([^\s]+)/g, (...f) => stars(f[1]) + '@' + stars(f[2]) + '.' + stars(f[3]));
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
