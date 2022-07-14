import type { Writer, Message } from "./types.js";
export default Message;
export declare const classes: Map<number, Function>;
declare class _BatchMeta implements Message {
    pageNo: number;
    firstIndex: number;
    timestamp: number;
    readonly _id: number;
    constructor(pageNo: number, firstIndex: number, timestamp: number);
    encode(writer: Writer): boolean;
}
export declare const BatchMeta: typeof _BatchMeta & ((pageNo: number, firstIndex: number, timestamp: number) => _BatchMeta);
declare class _Timestamp implements Message {
    timestamp: number;
    readonly _id: number;
    constructor(timestamp: number);
    encode(writer: Writer): boolean;
}
export declare const Timestamp: typeof _Timestamp & ((timestamp: number) => _Timestamp);
declare class _SetPageLocation implements Message {
    url: string;
    referrer: string;
    navigationStart: number;
    readonly _id: number;
    constructor(url: string, referrer: string, navigationStart: number);
    encode(writer: Writer): boolean;
}
export declare const SetPageLocation: typeof _SetPageLocation & ((url: string, referrer: string, navigationStart: number) => _SetPageLocation);
declare class _SetViewportSize implements Message {
    width: number;
    height: number;
    readonly _id: number;
    constructor(width: number, height: number);
    encode(writer: Writer): boolean;
}
export declare const SetViewportSize: typeof _SetViewportSize & ((width: number, height: number) => _SetViewportSize);
declare class _SetViewportScroll implements Message {
    x: number;
    y: number;
    readonly _id: number;
    constructor(x: number, y: number);
    encode(writer: Writer): boolean;
}
export declare const SetViewportScroll: typeof _SetViewportScroll & ((x: number, y: number) => _SetViewportScroll);
declare class _CreateDocument implements Message {
    readonly _id: number;
    constructor();
    encode(writer: Writer): boolean;
}
export declare const CreateDocument: typeof _CreateDocument & (() => _CreateDocument);
declare class _CreateElementNode implements Message {
    id: number;
    parentID: number;
    index: number;
    tag: string;
    svg: boolean;
    readonly _id: number;
    constructor(id: number, parentID: number, index: number, tag: string, svg: boolean);
    encode(writer: Writer): boolean;
}
export declare const CreateElementNode: typeof _CreateElementNode & ((id: number, parentID: number, index: number, tag: string, svg: boolean) => _CreateElementNode);
declare class _CreateTextNode implements Message {
    id: number;
    parentID: number;
    index: number;
    readonly _id: number;
    constructor(id: number, parentID: number, index: number);
    encode(writer: Writer): boolean;
}
export declare const CreateTextNode: typeof _CreateTextNode & ((id: number, parentID: number, index: number) => _CreateTextNode);
declare class _MoveNode implements Message {
    id: number;
    parentID: number;
    index: number;
    readonly _id: number;
    constructor(id: number, parentID: number, index: number);
    encode(writer: Writer): boolean;
}
export declare const MoveNode: typeof _MoveNode & ((id: number, parentID: number, index: number) => _MoveNode);
declare class _RemoveNode implements Message {
    id: number;
    readonly _id: number;
    constructor(id: number);
    encode(writer: Writer): boolean;
}
export declare const RemoveNode: typeof _RemoveNode & ((id: number) => _RemoveNode);
declare class _SetNodeAttribute implements Message {
    id: number;
    name: string;
    value: string;
    readonly _id: number;
    constructor(id: number, name: string, value: string);
    encode(writer: Writer): boolean;
}
export declare const SetNodeAttribute: typeof _SetNodeAttribute & ((id: number, name: string, value: string) => _SetNodeAttribute);
declare class _RemoveNodeAttribute implements Message {
    id: number;
    name: string;
    readonly _id: number;
    constructor(id: number, name: string);
    encode(writer: Writer): boolean;
}
export declare const RemoveNodeAttribute: typeof _RemoveNodeAttribute & ((id: number, name: string) => _RemoveNodeAttribute);
declare class _SetNodeData implements Message {
    id: number;
    data: string;
    readonly _id: number;
    constructor(id: number, data: string);
    encode(writer: Writer): boolean;
}
export declare const SetNodeData: typeof _SetNodeData & ((id: number, data: string) => _SetNodeData);
declare class _SetNodeScroll implements Message {
    id: number;
    x: number;
    y: number;
    readonly _id: number;
    constructor(id: number, x: number, y: number);
    encode(writer: Writer): boolean;
}
export declare const SetNodeScroll: typeof _SetNodeScroll & ((id: number, x: number, y: number) => _SetNodeScroll);
declare class _SetInputTarget implements Message {
    id: number;
    label: string;
    readonly _id: number;
    constructor(id: number, label: string);
    encode(writer: Writer): boolean;
}
export declare const SetInputTarget: typeof _SetInputTarget & ((id: number, label: string) => _SetInputTarget);
declare class _SetInputValue implements Message {
    id: number;
    value: string;
    mask: number;
    readonly _id: number;
    constructor(id: number, value: string, mask: number);
    encode(writer: Writer): boolean;
}
export declare const SetInputValue: typeof _SetInputValue & ((id: number, value: string, mask: number) => _SetInputValue);
declare class _SetInputChecked implements Message {
    id: number;
    checked: boolean;
    readonly _id: number;
    constructor(id: number, checked: boolean);
    encode(writer: Writer): boolean;
}
export declare const SetInputChecked: typeof _SetInputChecked & ((id: number, checked: boolean) => _SetInputChecked);
declare class _MouseMove implements Message {
    x: number;
    y: number;
    readonly _id: number;
    constructor(x: number, y: number);
    encode(writer: Writer): boolean;
}
export declare const MouseMove: typeof _MouseMove & ((x: number, y: number) => _MouseMove);
declare class _ConsoleLog implements Message {
    level: string;
    value: string;
    readonly _id: number;
    constructor(level: string, value: string);
    encode(writer: Writer): boolean;
}
export declare const ConsoleLog: typeof _ConsoleLog & ((level: string, value: string) => _ConsoleLog);
declare class _PageLoadTiming implements Message {
    requestStart: number;
    responseStart: number;
    responseEnd: number;
    domContentLoadedEventStart: number;
    domContentLoadedEventEnd: number;
    loadEventStart: number;
    loadEventEnd: number;
    firstPaint: number;
    firstContentfulPaint: number;
    readonly _id: number;
    constructor(requestStart: number, responseStart: number, responseEnd: number, domContentLoadedEventStart: number, domContentLoadedEventEnd: number, loadEventStart: number, loadEventEnd: number, firstPaint: number, firstContentfulPaint: number);
    encode(writer: Writer): boolean;
}
export declare const PageLoadTiming: typeof _PageLoadTiming & ((requestStart: number, responseStart: number, responseEnd: number, domContentLoadedEventStart: number, domContentLoadedEventEnd: number, loadEventStart: number, loadEventEnd: number, firstPaint: number, firstContentfulPaint: number) => _PageLoadTiming);
declare class _PageRenderTiming implements Message {
    speedIndex: number;
    visuallyComplete: number;
    timeToInteractive: number;
    readonly _id: number;
    constructor(speedIndex: number, visuallyComplete: number, timeToInteractive: number);
    encode(writer: Writer): boolean;
}
export declare const PageRenderTiming: typeof _PageRenderTiming & ((speedIndex: number, visuallyComplete: number, timeToInteractive: number) => _PageRenderTiming);
declare class _JSException implements Message {
    name: string;
    message: string;
    payload: string;
    readonly _id: number;
    constructor(name: string, message: string, payload: string);
    encode(writer: Writer): boolean;
}
export declare const JSException: typeof _JSException & ((name: string, message: string, payload: string) => _JSException);
declare class _RawCustomEvent implements Message {
    name: string;
    payload: string;
    readonly _id: number;
    constructor(name: string, payload: string);
    encode(writer: Writer): boolean;
}
export declare const RawCustomEvent: typeof _RawCustomEvent & ((name: string, payload: string) => _RawCustomEvent);
declare class _UserID implements Message {
    id: string;
    readonly _id: number;
    constructor(id: string);
    encode(writer: Writer): boolean;
}
export declare const UserID: typeof _UserID & ((id: string) => _UserID);
declare class _UserAnonymousID implements Message {
    id: string;
    readonly _id: number;
    constructor(id: string);
    encode(writer: Writer): boolean;
}
export declare const UserAnonymousID: typeof _UserAnonymousID & ((id: string) => _UserAnonymousID);
declare class _Metadata implements Message {
    key: string;
    value: string;
    readonly _id: number;
    constructor(key: string, value: string);
    encode(writer: Writer): boolean;
}
export declare const Metadata: typeof _Metadata & ((key: string, value: string) => _Metadata);
declare class _CSSInsertRule implements Message {
    id: number;
    rule: string;
    index: number;
    readonly _id: number;
    constructor(id: number, rule: string, index: number);
    encode(writer: Writer): boolean;
}
export declare const CSSInsertRule: typeof _CSSInsertRule & ((id: number, rule: string, index: number) => _CSSInsertRule);
declare class _CSSDeleteRule implements Message {
    id: number;
    index: number;
    readonly _id: number;
    constructor(id: number, index: number);
    encode(writer: Writer): boolean;
}
export declare const CSSDeleteRule: typeof _CSSDeleteRule & ((id: number, index: number) => _CSSDeleteRule);
declare class _Fetch implements Message {
    method: string;
    url: string;
    request: string;
    response: string;
    status: number;
    timestamp: number;
    duration: number;
    readonly _id: number;
    constructor(method: string, url: string, request: string, response: string, status: number, timestamp: number, duration: number);
    encode(writer: Writer): boolean;
}
export declare const Fetch: typeof _Fetch & ((method: string, url: string, request: string, response: string, status: number, timestamp: number, duration: number) => _Fetch);
declare class _Profiler implements Message {
    name: string;
    duration: number;
    args: string;
    result: string;
    readonly _id: number;
    constructor(name: string, duration: number, args: string, result: string);
    encode(writer: Writer): boolean;
}
export declare const Profiler: typeof _Profiler & ((name: string, duration: number, args: string, result: string) => _Profiler);
declare class _OTable implements Message {
    key: string;
    value: string;
    readonly _id: number;
    constructor(key: string, value: string);
    encode(writer: Writer): boolean;
}
export declare const OTable: typeof _OTable & ((key: string, value: string) => _OTable);
declare class _StateAction implements Message {
    type: string;
    readonly _id: number;
    constructor(type: string);
    encode(writer: Writer): boolean;
}
export declare const StateAction: typeof _StateAction & ((type: string) => _StateAction);
declare class _Redux implements Message {
    action: string;
    state: string;
    duration: number;
    readonly _id: number;
    constructor(action: string, state: string, duration: number);
    encode(writer: Writer): boolean;
}
export declare const Redux: typeof _Redux & ((action: string, state: string, duration: number) => _Redux);
declare class _Vuex implements Message {
    mutation: string;
    state: string;
    readonly _id: number;
    constructor(mutation: string, state: string);
    encode(writer: Writer): boolean;
}
export declare const Vuex: typeof _Vuex & ((mutation: string, state: string) => _Vuex);
declare class _MobX implements Message {
    type: string;
    payload: string;
    readonly _id: number;
    constructor(type: string, payload: string);
    encode(writer: Writer): boolean;
}
export declare const MobX: typeof _MobX & ((type: string, payload: string) => _MobX);
declare class _NgRx implements Message {
    action: string;
    state: string;
    duration: number;
    readonly _id: number;
    constructor(action: string, state: string, duration: number);
    encode(writer: Writer): boolean;
}
export declare const NgRx: typeof _NgRx & ((action: string, state: string, duration: number) => _NgRx);
declare class _GraphQL implements Message {
    operationKind: string;
    operationName: string;
    variables: string;
    response: string;
    readonly _id: number;
    constructor(operationKind: string, operationName: string, variables: string, response: string);
    encode(writer: Writer): boolean;
}
export declare const GraphQL: typeof _GraphQL & ((operationKind: string, operationName: string, variables: string, response: string) => _GraphQL);
declare class _PerformanceTrack implements Message {
    frames: number;
    ticks: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    readonly _id: number;
    constructor(frames: number, ticks: number, totalJSHeapSize: number, usedJSHeapSize: number);
    encode(writer: Writer): boolean;
}
export declare const PerformanceTrack: typeof _PerformanceTrack & ((frames: number, ticks: number, totalJSHeapSize: number, usedJSHeapSize: number) => _PerformanceTrack);
declare class _ResourceTiming implements Message {
    timestamp: number;
    duration: number;
    ttfb: number;
    headerSize: number;
    encodedBodySize: number;
    decodedBodySize: number;
    url: string;
    initiator: string;
    readonly _id: number;
    constructor(timestamp: number, duration: number, ttfb: number, headerSize: number, encodedBodySize: number, decodedBodySize: number, url: string, initiator: string);
    encode(writer: Writer): boolean;
}
export declare const ResourceTiming: typeof _ResourceTiming & ((timestamp: number, duration: number, ttfb: number, headerSize: number, encodedBodySize: number, decodedBodySize: number, url: string, initiator: string) => _ResourceTiming);
declare class _ConnectionInformation implements Message {
    downlink: number;
    type: string;
    readonly _id: number;
    constructor(downlink: number, type: string);
    encode(writer: Writer): boolean;
}
export declare const ConnectionInformation: typeof _ConnectionInformation & ((downlink: number, type: string) => _ConnectionInformation);
declare class _SetPageVisibility implements Message {
    hidden: boolean;
    readonly _id: number;
    constructor(hidden: boolean);
    encode(writer: Writer): boolean;
}
export declare const SetPageVisibility: typeof _SetPageVisibility & ((hidden: boolean) => _SetPageVisibility);
declare class _LongTask implements Message {
    timestamp: number;
    duration: number;
    context: number;
    containerType: number;
    containerSrc: string;
    containerId: string;
    containerName: string;
    readonly _id: number;
    constructor(timestamp: number, duration: number, context: number, containerType: number, containerSrc: string, containerId: string, containerName: string);
    encode(writer: Writer): boolean;
}
export declare const LongTask: typeof _LongTask & ((timestamp: number, duration: number, context: number, containerType: number, containerSrc: string, containerId: string, containerName: string) => _LongTask);
declare class _SetNodeAttributeURLBased implements Message {
    id: number;
    name: string;
    value: string;
    baseURL: string;
    readonly _id: number;
    constructor(id: number, name: string, value: string, baseURL: string);
    encode(writer: Writer): boolean;
}
export declare const SetNodeAttributeURLBased: typeof _SetNodeAttributeURLBased & ((id: number, name: string, value: string, baseURL: string) => _SetNodeAttributeURLBased);
declare class _SetCSSDataURLBased implements Message {
    id: number;
    data: string;
    baseURL: string;
    readonly _id: number;
    constructor(id: number, data: string, baseURL: string);
    encode(writer: Writer): boolean;
}
export declare const SetCSSDataURLBased: typeof _SetCSSDataURLBased & ((id: number, data: string, baseURL: string) => _SetCSSDataURLBased);
declare class _TechnicalInfo implements Message {
    type: string;
    value: string;
    readonly _id: number;
    constructor(type: string, value: string);
    encode(writer: Writer): boolean;
}
export declare const TechnicalInfo: typeof _TechnicalInfo & ((type: string, value: string) => _TechnicalInfo);
declare class _CustomIssue implements Message {
    name: string;
    payload: string;
    readonly _id: number;
    constructor(name: string, payload: string);
    encode(writer: Writer): boolean;
}
export declare const CustomIssue: typeof _CustomIssue & ((name: string, payload: string) => _CustomIssue);
declare class _PageClose implements Message {
    readonly _id: number;
    constructor();
    encode(writer: Writer): boolean;
}
export declare const PageClose: typeof _PageClose & (() => _PageClose);
declare class _CSSInsertRuleURLBased implements Message {
    id: number;
    rule: string;
    index: number;
    baseURL: string;
    readonly _id: number;
    constructor(id: number, rule: string, index: number, baseURL: string);
    encode(writer: Writer): boolean;
}
export declare const CSSInsertRuleURLBased: typeof _CSSInsertRuleURLBased & ((id: number, rule: string, index: number, baseURL: string) => _CSSInsertRuleURLBased);
declare class _MouseClick implements Message {
    id: number;
    hesitationTime: number;
    label: string;
    selector: string;
    readonly _id: number;
    constructor(id: number, hesitationTime: number, label: string, selector: string);
    encode(writer: Writer): boolean;
}
export declare const MouseClick: typeof _MouseClick & ((id: number, hesitationTime: number, label: string, selector: string) => _MouseClick);
declare class _CreateIFrameDocument implements Message {
    frameID: number;
    id: number;
    readonly _id: number;
    constructor(frameID: number, id: number);
    encode(writer: Writer): boolean;
}
export declare const CreateIFrameDocument: typeof _CreateIFrameDocument & ((frameID: number, id: number) => _CreateIFrameDocument);
