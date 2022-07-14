"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observer_js_1 = require("./observer.js");
const messages_js_1 = require("../../common/messages.js");
class ShadowRootObserver extends observer_js_1.default {
    observe(el) {
        const shRoot = el.shadowRoot;
        const hostID = this.app.nodes.getID(el);
        if (!shRoot || hostID === undefined) {
            return;
        } // log
        this.observeRoot(shRoot, (rootID) => {
            if (rootID === undefined) {
                console.log("OpenReplay: Shadow Root was not bound");
                return;
            }
            this.app.send((0, messages_js_1.CreateIFrameDocument)(hostID, rootID));
        });
    }
}
exports.default = ShadowRootObserver;
