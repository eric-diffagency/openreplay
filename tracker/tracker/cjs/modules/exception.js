"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExceptionMessageFromEvent = exports.getExceptionMessage = void 0;
const messages_js_1 = require("../common/messages.js");
const error_stack_parser_1 = require("error-stack-parser");
function getDefaultStack(e) {
    return [{
            columnNumber: e.colno,
            lineNumber: e.lineno,
            fileName: e.filename,
            functionName: "",
            source: "",
        }];
}
function getExceptionMessage(error, fallbackStack) {
    let stack = fallbackStack;
    try {
        stack = error_stack_parser_1.default.parse(error);
    }
    catch (e) {
    }
    return new messages_js_1.JSException(error.name, error.message, JSON.stringify(stack));
}
exports.getExceptionMessage = getExceptionMessage;
function getExceptionMessageFromEvent(e) {
    if (e instanceof ErrorEvent) {
        if (e.error instanceof Error) {
            return getExceptionMessage(e.error, getDefaultStack(e));
        }
        else {
            let [name, message] = e.message.split(':');
            if (!message) {
                name = 'Error';
                message = e.message;
            }
            return new messages_js_1.JSException(name, message, JSON.stringify(getDefaultStack(e)));
        }
    }
    else if ('PromiseRejectionEvent' in window && e instanceof PromiseRejectionEvent) {
        if (e.reason instanceof Error) {
            return getExceptionMessage(e.reason, []);
        }
        else {
            let message;
            try {
                message = JSON.stringify(e.reason);
            }
            catch (_) {
                message = String(e.reason);
            }
            return new messages_js_1.JSException('Unhandled Promise Rejection', message, '[]');
        }
    }
    return null;
}
exports.getExceptionMessageFromEvent = getExceptionMessageFromEvent;
function default_1(app, opts) {
    const options = Object.assign({
        captureExceptions: true,
    }, opts);
    if (options.captureExceptions) {
        const handler = (e) => {
            const msg = getExceptionMessageFromEvent(e);
            if (msg != null) {
                app.send(msg);
            }
        };
        app.attachEventListener(window, 'unhandledrejection', (e) => handler(e));
        app.attachEventListener(window, 'error', (e) => handler(e));
    }
}
exports.default = default_1;
