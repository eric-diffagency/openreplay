"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_js_1 = require("../common/messages.js");
function default_1(app) {
    const connection = navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
    if (connection === undefined) {
        return;
    }
    const sendConnectionInformation = () => app.send(new messages_js_1.ConnectionInformation(Math.round(connection.downlink * 1000), connection.type || 'unknown'));
    sendConnectionInformation();
    connection.addEventListener('change', sendConnectionInformation);
}
exports.default = default_1;
