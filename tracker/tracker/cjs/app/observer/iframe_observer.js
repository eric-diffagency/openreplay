"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observer_js_1 = require("./observer.js");
const messages_js_1 = require("../../common/messages.js");
class IFrameObserver extends observer_js_1.default {
    observe(iframe) {
        const doc = iframe.contentDocument;
        const hostID = this.app.nodes.getID(iframe);
        if (!doc || hostID === undefined) {
            return;
        } //log TODO common app.logger
        // Have to observe document, because the inner <html> might be changed
        this.observeRoot(doc, (docID) => {
            if (docID === undefined) {
                console.log("OpenReplay: Iframe document not bound");
                return;
            }
            this.app.send((0, messages_js_1.CreateIFrameDocument)(hostID, docID));
        });
    }
}
exports.default = IFrameObserver;
