"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Session {
    constructor() {
        this.metadata = {};
        this.userID = null;
        this.sessionID = null;
        this.callbacks = [];
    }
    attachUpdateCallback(cb) {
        this.callbacks.push(cb);
    }
    handleUpdate(newInfo) {
        if (newInfo.userID == null) {
            delete newInfo.userID;
        }
        if (newInfo.sessionID == null) {
            delete newInfo.sessionID;
        }
        this.callbacks.forEach(cb => cb(newInfo));
    }
    update(newInfo) {
        if (newInfo.userID !== undefined) { // TODO clear nullable/undefinable types
            this.userID = newInfo.userID;
        }
        if (newInfo.metadata !== undefined) {
            Object.entries(newInfo.metadata).forEach(([k, v]) => this.metadata[k] = v);
        }
        if (newInfo.sessionID !== undefined) {
            this.sessionID = newInfo.sessionID;
        }
        this.handleUpdate(newInfo);
    }
    setMetadata(key, value) {
        this.metadata[key] = value;
        this.handleUpdate({ metadata: { [key]: value } });
    }
    setUserID(userID) {
        this.userID = userID;
        this.handleUpdate({ userID });
    }
    getInfo() {
        return {
            sessionID: this.sessionID,
            metadata: this.metadata,
            userID: this.userID,
        };
    }
    reset() {
        this.metadata = {};
        this.userID = null;
        this.sessionID = null;
    }
}
exports.default = Session;
