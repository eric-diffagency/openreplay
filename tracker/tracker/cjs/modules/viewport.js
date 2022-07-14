"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_js_1 = require("../common/messages.js");
function default_1(app) {
    let url, width, height;
    let navigationStart = performance.timing.navigationStart;
    const sendSetPageLocation = app.safe(() => {
        const { URL } = document;
        if (URL !== url) {
            url = URL;
            app.send(new messages_js_1.SetPageLocation(url, document.referrer, navigationStart));
            navigationStart = 0;
        }
    });
    const sendSetViewportSize = app.safe(() => {
        const { innerWidth, innerHeight } = window;
        if (innerWidth !== width || innerHeight !== height) {
            width = innerWidth;
            height = innerHeight;
            app.send(new messages_js_1.SetViewportSize(width, height));
        }
    });
    const sendSetPageVisibility = document.hidden === undefined
        ? Function.prototype
        : app.safe(() => app.send(new messages_js_1.SetPageVisibility(document.hidden)));
    app.attachStartCallback(() => {
        url = '';
        width = height = -1;
        sendSetPageLocation();
        sendSetViewportSize();
        sendSetPageVisibility();
    });
    if (document.hidden !== undefined) {
        app.attachEventListener(document, 'visibilitychange', sendSetPageVisibility, false, false);
    }
    app.ticker.attach(sendSetPageLocation, 1, false);
    app.ticker.attach(sendSetViewportSize, 5, false);
}
exports.default = default_1;
