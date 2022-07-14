"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Nodes {
    constructor(node_id) {
        this.node_id = node_id;
        this.nodes = [];
        this.nodeCallbacks = [];
        this.elementListeners = new Map();
    }
    attachNodeCallback(nodeCallback) {
        this.nodeCallbacks.push(nodeCallback);
    }
    attachElementListener(type, node, elementListener) {
        const id = this.getID(node);
        if (id === undefined) {
            return;
        }
        node.addEventListener(type, elementListener);
        let listeners = this.elementListeners.get(id);
        if (listeners === undefined) {
            listeners = [];
            this.elementListeners.set(id, listeners);
            return;
        }
        listeners.push([type, elementListener]);
    }
    registerNode(node) {
        let id = node[this.node_id];
        const isNew = id === undefined;
        if (isNew) {
            id = this.nodes.length;
            this.nodes[id] = node;
            node[this.node_id] = id;
        }
        return [id, isNew];
    }
    unregisterNode(node) {
        const id = node[this.node_id];
        if (id !== undefined) {
            delete node[this.node_id];
            this.nodes[id] = undefined;
            const listeners = this.elementListeners.get(id);
            if (listeners !== undefined) {
                this.elementListeners.delete(id);
                listeners.forEach((listener) => node.removeEventListener(listener[0], listener[1]));
            }
        }
        return id;
    }
    callNodeCallbacks(node, isStart) {
        this.nodeCallbacks.forEach((cb) => cb(node, isStart));
    }
    getID(node) {
        return node[this.node_id];
    }
    getNode(id) {
        return this.nodes[id];
    }
    clear() {
        for (let id = 0; id < this.nodes.length; id++) {
            const node = this.nodes[id];
            if (node === undefined) {
                continue;
            }
            this.unregisterNode(node);
        }
        this.nodes.length = 0;
    }
}
exports.default = Nodes;
