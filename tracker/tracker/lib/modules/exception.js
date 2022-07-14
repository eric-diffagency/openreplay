import { JSException } from "../common/messages.js";
import ErrorStackParser from 'error-stack-parser';
function getDefaultStack(e) {
    return [{
            columnNumber: e.colno,
            lineNumber: e.lineno,
            fileName: e.filename,
            functionName: "",
            source: "",
        }];
}
export function getExceptionMessage(error, fallbackStack) {
    let stack = fallbackStack;
    try {
        stack = ErrorStackParser.parse(error);
    }
    catch (e) {
    }
    return new JSException(error.name, error.message, JSON.stringify(stack));
}
export function getExceptionMessageFromEvent(e) {
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
            return new JSException(name, message, JSON.stringify(getDefaultStack(e)));
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
            return new JSException('Unhandled Promise Rejection', message, '[]');
        }
    }
    return null;
}
export default function (app, opts) {
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
