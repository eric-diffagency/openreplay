interface SessionInfo {
    sessionID: string | null;
    metadata: Record<string, string>;
    userID: string | null;
}
declare type OnUpdateCallback = (i: Partial<SessionInfo>) => void;
export default class Session {
    private metadata;
    private userID;
    private sessionID;
    private callbacks;
    attachUpdateCallback(cb: OnUpdateCallback): void;
    private handleUpdate;
    update(newInfo: Partial<SessionInfo>): void;
    setMetadata(key: string, value: string): void;
    setUserID(userID: string): void;
    getInfo(): SessionInfo;
    reset(): void;
}
export {};
