import type Message from "../common/messages.js";
import Nodes from "./nodes.js";
import Sanitizer from "./sanitizer.js";
import Ticker from "./ticker.js";
import Logger from "./logger.js";
import Session from "./session.js";
import type { Options as ObserverOptions } from "./observer/top_observer.js";
import type { Options as SanitizerOptions } from "./sanitizer.js";
import type { Options as LoggerOptions } from "./logger.js";
import type { Options as WebworkerOptions } from "../common/webworker.js";
export interface StartOptions {
    userID?: string;
    metadata?: Record<string, string>;
    forceNew?: boolean;
}
interface OnStartInfo {
    sessionID: string;
    sessionToken: string;
    userUUID: string;
}
declare const CANCELED: "canceled";
declare type SuccessfulStart = OnStartInfo & {
    success: true;
};
declare type UnsuccessfulStart = {
    reason: typeof CANCELED | string;
    success: false;
};
declare const UnsuccessfulStart: (reason: string) => UnsuccessfulStart;
declare const SuccessfulStart: (body: OnStartInfo) => SuccessfulStart;
export declare type StartPromiseReturn = SuccessfulStart | UnsuccessfulStart;
declare type StartCallback = (i: OnStartInfo) => void;
declare type CommitCallback = (messages: Array<Message>) => void;
declare type AppOptions = {
    revID: string;
    node_id: string;
    session_token_key: string;
    session_pageno_key: string;
    session_reset_key: string;
    local_uuid_key: string;
    ingestPoint: string;
    resourceBaseHref: string | null;
    verbose: boolean;
    __is_snippet: boolean;
    __debug_report_edp: string | null;
    __debug__?: LoggerOptions;
    localStorage: Storage | null;
    sessionStorage: Storage | null;
    onStart?: StartCallback;
} & WebworkerOptions;
export declare type Options = AppOptions & ObserverOptions & SanitizerOptions;
export declare const DEFAULT_INGEST_POINT = "https://api.openreplay.com/ingest";
export default class App {
    readonly nodes: Nodes;
    readonly ticker: Ticker;
    readonly projectKey: string;
    readonly sanitizer: Sanitizer;
    readonly debug: Logger;
    readonly notify: Logger;
    readonly session: Session;
    readonly localStorage: Storage;
    readonly sessionStorage: Storage;
    private readonly messages;
    private readonly observer;
    private readonly startCallbacks;
    private readonly stopCallbacks;
    private readonly commitCallbacks;
    private readonly options;
    private readonly revID;
    private activityState;
    private version;
    private readonly worker?;
    constructor(projectKey: string, sessionToken: string | null | undefined, options: Partial<Options>);
    private _debug;
    send(message: Message, urgent?: boolean): void;
    private commit;
    safe<T extends (...args: any[]) => void>(fn: T): T;
    attachCommitCallback(cb: CommitCallback): void;
    attachStartCallback(cb: StartCallback): void;
    attachStopCallback(cb: Function): void;
    attachEventListener(target: EventTarget, type: string, listener: EventListener, useSafe?: boolean, useCapture?: boolean): void;
    checkRequiredVersion(version: string): boolean;
    private getStartInfo;
    getSessionInfo(): {
        userUUID: string | null;
        projectKey: string;
        revID: string;
        timestamp: number;
        trackerVersion: string;
        isSnippet: boolean;
        sessionID: string | null;
        metadata: Record<string, string>;
        userID: string | null;
    };
    getSessionToken(): string | undefined;
    getSessionID(): string | undefined;
    getHost(): string;
    getProjectKey(): string;
    getBaseHref(): string;
    resolveResourceURL(resourceURL: string): string;
    isServiceURL(url: string): boolean;
    active(): boolean;
    resetNextPageSession(flag: boolean): void;
    private _start;
    start(options?: StartOptions): Promise<StartPromiseReturn>;
    stop(calledFromAPI?: boolean): void;
}
export {};
