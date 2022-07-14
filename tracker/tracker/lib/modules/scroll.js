import { SetViewportScroll, SetNodeScroll } from "../common/messages.js";
import { isElementNode } from "../app/guards.js";
export default function (app) {
    let documentScroll = false;
    const nodeScroll = new Map();
    const sendSetViewportScroll = app.safe(() => app.send(new SetViewportScroll(window.pageXOffset ||
        (document.documentElement && document.documentElement.scrollLeft) ||
        (document.body && document.body.scrollLeft) ||
        0, window.pageYOffset ||
        (document.documentElement && document.documentElement.scrollTop) ||
        (document.body && document.body.scrollTop) ||
        0)));
    const sendSetNodeScroll = app.safe((s, node) => {
        const id = app.nodes.getID(node);
        if (id !== undefined) {
            app.send(new SetNodeScroll(id, s[0], s[1]));
        }
    });
    app.attachStartCallback(sendSetViewportScroll);
    app.attachStopCallback(() => {
        documentScroll = false;
        nodeScroll.clear();
    });
    app.nodes.attachNodeCallback((node, isStart) => {
        if (isStart && isElementNode(node) && node.scrollLeft + node.scrollTop > 0) {
            nodeScroll.set(node, [node.scrollLeft, node.scrollTop]);
        }
    });
    app.attachEventListener(window, 'scroll', (e) => {
        const target = e.target;
        if (target === document) {
            documentScroll = true;
            return;
        }
        if (target instanceof Element) {
            nodeScroll.set(target, [target.scrollLeft, target.scrollTop]);
        }
    });
    app.ticker.attach(() => {
        if (documentScroll) {
            sendSetViewportScroll();
            documentScroll = false;
        }
        nodeScroll.forEach(sendSetNodeScroll);
        nodeScroll.clear();
    }, 5, false);
}
