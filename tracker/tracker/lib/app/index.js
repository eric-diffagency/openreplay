import { Timestamp, Metadata, UserID } from "../common/messages.js";
import { timestamp } from "../utils.js";
import Nodes from "./nodes.js";
import Observer from "./observer/top_observer.js";
import Sanitizer from "./sanitizer.js";
import Ticker from "./ticker.js";
import Logger, { LogLevel } from "./logger.js";
import Session from "./session.js";
import { deviceMemory, jsHeapSizeLimit } from "../modules/performance.js";
const CANCELED = "canceled";
const START_ERROR = ":(";
const UnsuccessfulStart = (reason) => ({ reason, success: false });
const SuccessfulStart = (body) => (Object.assign(Object.assign({}, body), { success: true }));
var ActivityState;
(function (ActivityState) {
    ActivityState[ActivityState["NotActive"] = 0] = "NotActive";
    ActivityState[ActivityState["Starting"] = 1] = "Starting";
    ActivityState[ActivityState["Active"] = 2] = "Active";
})(ActivityState || (ActivityState = {}));
// TODO: use backendHost only
export const DEFAULT_INGEST_POINT = 'https://api.openreplay.com/ingest';
export default class App {
    constructor(projectKey, sessionToken, options) {
        // if (options.onStart !== undefined) {
        //   deprecationWarn("'onStart' option", "tracker.start().then(/* handle session info */)")
        // } ?? maybe onStart is good
        var _a, _b;
        this.messages = [];
        this.startCallbacks = [];
        this.stopCallbacks = [];
        this.commitCallbacks = [];
        this.activityState = ActivityState.NotActive;
        this.version = '3.5.15'; // TODO: version compatability check inside each plugin.
        this.projectKey = projectKey;
        this.options = Object.assign({
            revID: '',
            node_id: '__openreplay_id',
            session_token_key: '__openreplay_token',
            session_pageno_key: '__openreplay_pageno',
            session_reset_key: '__openreplay_reset',
            local_uuid_key: '__openreplay_uuid',
            ingestPoint: DEFAULT_INGEST_POINT,
            resourceBaseHref: null,
            verbose: false,
            __is_snippet: false,
            __debug_report_edp: null,
            localStorage: null,
            sessionStorage: null,
        }, options);
        this.revID = this.options.revID;
        this.sanitizer = new Sanitizer(this, options);
        this.nodes = new Nodes(this.options.node_id);
        this.observer = new Observer(this, options);
        this.ticker = new Ticker(this);
        this.ticker.attach(() => this.commit());
        this.debug = new Logger(this.options.__debug__);
        this.notify = new Logger(this.options.verbose ? LogLevel.Warnings : LogLevel.Silent);
        this.session = new Session();
        this.session.attachUpdateCallback(({ userID, metadata }) => {
            if (userID != null) { // TODO: nullable userID
                this.send(new UserID(userID));
            }
            if (metadata != null) {
                Object.entries(metadata).forEach(([key, value]) => this.send(new Metadata(key, value)));
            }
        });
        this.localStorage = (_a = this.options.localStorage) !== null && _a !== void 0 ? _a : window.localStorage;
        this.sessionStorage = (_b = this.options.sessionStorage) !== null && _b !== void 0 ? _b : window.sessionStorage;
        if (sessionToken != null) {
            this.sessionStorage.setItem(this.options.session_token_key, sessionToken);
        }
        try {
            this.worker = new Worker(URL.createObjectURL(new Blob([`"use strict";function t(t){function i(...i){return new t(...i)}return i.prototype=t.prototype,i}const i=new Map;const s=t(class{constructor(t,i,s){this.pageNo=t,this.firstIndex=i,this.timestamp=s,this._id=80}encode(t){return t.uint(80)&&t.uint(this.pageNo)&&t.uint(this.firstIndex)&&t.int(this.timestamp)}});i.set(80,s);const e=t(class{constructor(t){this.timestamp=t,this._id=0}encode(t){return t.uint(0)&&t.uint(this.timestamp)}});i.set(0,e);const n=t(class{constructor(t,i,s){this.url=t,this.referrer=i,this.navigationStart=s,this._id=4}encode(t){return t.uint(4)&&t.string(this.url)&&t.string(this.referrer)&&t.uint(this.navigationStart)}});i.set(4,n);const r=t(class{constructor(t,i){this.width=t,this.height=i,this._id=5}encode(t){return t.uint(5)&&t.uint(this.width)&&t.uint(this.height)}});i.set(5,r);const h=t(class{constructor(t,i){this.x=t,this.y=i,this._id=6}encode(t){return t.uint(6)&&t.int(this.x)&&t.int(this.y)}});i.set(6,h);const o=t(class{constructor(){this._id=7}encode(t){return t.uint(7)}});i.set(7,o);const c=t(class{constructor(t,i,s,e,n){this.id=t,this.parentID=i,this.index=s,this.tag=e,this.svg=n,this._id=8}encode(t){return t.uint(8)&&t.uint(this.id)&&t.uint(this.parentID)&&t.uint(this.index)&&t.string(this.tag)&&t.boolean(this.svg)}});i.set(8,c);const a=t(class{constructor(t,i,s){this.id=t,this.parentID=i,this.index=s,this._id=9}encode(t){return t.uint(9)&&t.uint(this.id)&&t.uint(this.parentID)&&t.uint(this.index)}});i.set(9,a);const u=t(class{constructor(t,i,s){this.id=t,this.parentID=i,this.index=s,this._id=10}encode(t){return t.uint(10)&&t.uint(this.id)&&t.uint(this.parentID)&&t.uint(this.index)}});i.set(10,u);const d=t(class{constructor(t){this.id=t,this._id=11}encode(t){return t.uint(11)&&t.uint(this.id)}});i.set(11,d);const l=t(class{constructor(t,i,s){this.id=t,this.name=i,this.value=s,this._id=12}encode(t){return t.uint(12)&&t.uint(this.id)&&t.string(this.name)&&t.string(this.value)}});i.set(12,l);const p=t(class{constructor(t,i){this.id=t,this.name=i,this._id=13}encode(t){return t.uint(13)&&t.uint(this.id)&&t.string(this.name)}});i.set(13,p);const g=t(class{constructor(t,i){this.id=t,this.data=i,this._id=14}encode(t){return t.uint(14)&&t.uint(this.id)&&t.string(this.data)}});i.set(14,g);const m=t(class{constructor(t,i,s){this.id=t,this.x=i,this.y=s,this._id=16}encode(t){return t.uint(16)&&t.uint(this.id)&&t.int(this.x)&&t.int(this.y)}});i.set(16,m);const f=t(class{constructor(t,i){this.id=t,this.label=i,this._id=17}encode(t){return t.uint(17)&&t.uint(this.id)&&t.string(this.label)}});i.set(17,f);const y=t(class{constructor(t,i,s){this.id=t,this.value=i,this.mask=s,this._id=18}encode(t){return t.uint(18)&&t.uint(this.id)&&t.string(this.value)&&t.int(this.mask)}});i.set(18,y);const _=t(class{constructor(t,i){this.id=t,this.checked=i,this._id=19}encode(t){return t.uint(19)&&t.uint(this.id)&&t.boolean(this.checked)}});i.set(19,_);const v=t(class{constructor(t,i){this.x=t,this.y=i,this._id=20}encode(t){return t.uint(20)&&t.uint(this.x)&&t.uint(this.y)}});i.set(20,v);const S=t(class{constructor(t,i){this.level=t,this.value=i,this._id=22}encode(t){return t.uint(22)&&t.string(this.level)&&t.string(this.value)}});i.set(22,S);const b=t(class{constructor(t,i,s,e,n,r,h,o,c){this.requestStart=t,this.responseStart=i,this.responseEnd=s,this.domContentLoadedEventStart=e,this.domContentLoadedEventEnd=n,this.loadEventStart=r,this.loadEventEnd=h,this.firstPaint=o,this.firstContentfulPaint=c,this._id=23}encode(t){return t.uint(23)&&t.uint(this.requestStart)&&t.uint(this.responseStart)&&t.uint(this.responseEnd)&&t.uint(this.domContentLoadedEventStart)&&t.uint(this.domContentLoadedEventEnd)&&t.uint(this.loadEventStart)&&t.uint(this.loadEventEnd)&&t.uint(this.firstPaint)&&t.uint(this.firstContentfulPaint)}});i.set(23,b);const w=t(class{constructor(t,i,s){this.speedIndex=t,this.visuallyComplete=i,this.timeToInteractive=s,this._id=24}encode(t){return t.uint(24)&&t.uint(this.speedIndex)&&t.uint(this.visuallyComplete)&&t.uint(this.timeToInteractive)}});i.set(24,w);const E=t(class{constructor(t,i,s){this.name=t,this.message=i,this.payload=s,this._id=25}encode(t){return t.uint(25)&&t.string(this.name)&&t.string(this.message)&&t.string(this.payload)}});i.set(25,E);const x=t(class{constructor(t,i){this.name=t,this.payload=i,this._id=27}encode(t){return t.uint(27)&&t.string(this.name)&&t.string(this.payload)}});i.set(27,x);const T=t(class{constructor(t){this.id=t,this._id=28}encode(t){return t.uint(28)&&t.string(this.id)}});i.set(28,T);const z=t(class{constructor(t){this.id=t,this._id=29}encode(t){return t.uint(29)&&t.string(this.id)}});i.set(29,z);const k=t(class{constructor(t,i){this.key=t,this.value=i,this._id=30}encode(t){return t.uint(30)&&t.string(this.key)&&t.string(this.value)}});i.set(30,k);const A=t(class{constructor(t,i,s){this.id=t,this.rule=i,this.index=s,this._id=37}encode(t){return t.uint(37)&&t.uint(this.id)&&t.string(this.rule)&&t.uint(this.index)}});i.set(37,A);const I=t(class{constructor(t,i){this.id=t,this.index=i,this._id=38}encode(t){return t.uint(38)&&t.uint(this.id)&&t.uint(this.index)}});i.set(38,I);const L=t(class{constructor(t,i,s,e,n,r,h){this.method=t,this.url=i,this.request=s,this.response=e,this.status=n,this.timestamp=r,this.duration=h,this._id=39}encode(t){return t.uint(39)&&t.string(this.method)&&t.string(this.url)&&t.string(this.request)&&t.string(this.response)&&t.uint(this.status)&&t.uint(this.timestamp)&&t.uint(this.duration)}});i.set(39,L);const C=t(class{constructor(t,i,s,e){this.name=t,this.duration=i,this.args=s,this.result=e,this._id=40}encode(t){return t.uint(40)&&t.string(this.name)&&t.uint(this.duration)&&t.string(this.args)&&t.string(this.result)}});i.set(40,C);const M=t(class{constructor(t,i){this.key=t,this.value=i,this._id=41}encode(t){return t.uint(41)&&t.string(this.key)&&t.string(this.value)}});i.set(41,M);const N=t(class{constructor(t){this.type=t,this._id=42}encode(t){return t.uint(42)&&t.string(this.type)}});i.set(42,N);const B=t(class{constructor(t,i,s){this.action=t,this.state=i,this.duration=s,this._id=44}encode(t){return t.uint(44)&&t.string(this.action)&&t.string(this.state)&&t.uint(this.duration)}});i.set(44,B);const U=t(class{constructor(t,i){this.mutation=t,this.state=i,this._id=45}encode(t){return t.uint(45)&&t.string(this.mutation)&&t.string(this.state)}});i.set(45,U);const R=t(class{constructor(t,i){this.type=t,this.payload=i,this._id=46}encode(t){return t.uint(46)&&t.string(this.type)&&t.string(this.payload)}});i.set(46,R);const O=t(class{constructor(t,i,s){this.action=t,this.state=i,this.duration=s,this._id=47}encode(t){return t.uint(47)&&t.string(this.action)&&t.string(this.state)&&t.uint(this.duration)}});i.set(47,O);const P=t(class{constructor(t,i,s,e){this.operationKind=t,this.operationName=i,this.variables=s,this.response=e,this._id=48}encode(t){return t.uint(48)&&t.string(this.operationKind)&&t.string(this.operationName)&&t.string(this.variables)&&t.string(this.response)}});i.set(48,P);const q=t(class{constructor(t,i,s,e){this.frames=t,this.ticks=i,this.totalJSHeapSize=s,this.usedJSHeapSize=e,this._id=49}encode(t){return t.uint(49)&&t.int(this.frames)&&t.int(this.ticks)&&t.uint(this.totalJSHeapSize)&&t.uint(this.usedJSHeapSize)}});i.set(49,q);const D=t(class{constructor(t,i,s,e,n,r,h,o){this.timestamp=t,this.duration=i,this.ttfb=s,this.headerSize=e,this.encodedBodySize=n,this.decodedBodySize=r,this.url=h,this.initiator=o,this._id=53}encode(t){return t.uint(53)&&t.uint(this.timestamp)&&t.uint(this.duration)&&t.uint(this.ttfb)&&t.uint(this.headerSize)&&t.uint(this.encodedBodySize)&&t.uint(this.decodedBodySize)&&t.string(this.url)&&t.string(this.initiator)}});i.set(53,D);const W=t(class{constructor(t,i){this.downlink=t,this.type=i,this._id=54}encode(t){return t.uint(54)&&t.uint(this.downlink)&&t.string(this.type)}});i.set(54,W);const H=t(class{constructor(t){this.hidden=t,this._id=55}encode(t){return t.uint(55)&&t.boolean(this.hidden)}});i.set(55,H);const J=t(class{constructor(t,i,s,e,n,r,h){this.timestamp=t,this.duration=i,this.context=s,this.containerType=e,this.containerSrc=n,this.containerId=r,this.containerName=h,this._id=59}encode(t){return t.uint(59)&&t.uint(this.timestamp)&&t.uint(this.duration)&&t.uint(this.context)&&t.uint(this.containerType)&&t.string(this.containerSrc)&&t.string(this.containerId)&&t.string(this.containerName)}});i.set(59,J);const F=t(class{constructor(t,i,s,e){this.id=t,this.name=i,this.value=s,this.baseURL=e,this._id=60}encode(t){return t.uint(60)&&t.uint(this.id)&&t.string(this.name)&&t.string(this.value)&&t.string(this.baseURL)}});i.set(60,F);const X=t(class{constructor(t,i,s){this.id=t,this.data=i,this.baseURL=s,this._id=61}encode(t){return t.uint(61)&&t.uint(this.id)&&t.string(this.data)&&t.string(this.baseURL)}});i.set(61,X);const G=t(class{constructor(t,i){this.type=t,this.value=i,this._id=63}encode(t){return t.uint(63)&&t.string(this.type)&&t.string(this.value)}});i.set(63,G);const K=t(class{constructor(t,i){this.name=t,this.payload=i,this._id=64}encode(t){return t.uint(64)&&t.string(this.name)&&t.string(this.payload)}});i.set(64,K);const j=t(class{constructor(){this._id=65}encode(t){return t.uint(65)}});i.set(65,j);const Q=t(class{constructor(t,i,s,e){this.id=t,this.rule=i,this.index=s,this.baseURL=e,this._id=67}encode(t){return t.uint(67)&&t.uint(this.id)&&t.string(this.rule)&&t.uint(this.index)&&t.string(this.baseURL)}});i.set(67,Q);const V=t(class{constructor(t,i,s,e){this.id=t,this.hesitationTime=i,this.label=s,this.selector=e,this._id=69}encode(t){return t.uint(69)&&t.uint(this.id)&&t.uint(this.hesitationTime)&&t.string(this.label)&&t.string(this.selector)}});i.set(69,V);const Y=t(class{constructor(t,i){this.frameID=t,this.id=i,this._id=70}encode(t){return t.uint(70)&&t.uint(this.frameID)&&t.uint(this.id)}});i.set(70,Y);class Z{constructor(t,i,s,e=10,n=1e3){this.onUnauthorised=i,this.onFailure=s,this.MAX_ATTEMPTS_COUNT=e,this.ATTEMPT_TIMEOUT=n,this.attemptsCount=0,this.busy=!1,this.queue=[],this.token=null,this.ingestURL=t+"/v1/web/i"}authorise(t){this.token=t}push(t){this.busy||!this.token?this.queue.push(t):this.sendBatch(t)}retry(t){this.attemptsCount>=this.MAX_ATTEMPTS_COUNT?this.onFailure():(this.attemptsCount++,setTimeout(()=>this.sendBatch(t),this.ATTEMPT_TIMEOUT*this.attemptsCount))}sendBatch(t){this.busy=!0,fetch(this.ingestURL,{body:t,method:"POST",headers:{Authorization:"Bearer "+this.token},keepalive:t.length<65536}).then(i=>{if(401===i.status)return this.busy=!1,void this.onUnauthorised();if(i.status>=400)return void this.retry(t);this.attemptsCount=0;const s=this.queue.shift();s?this.sendBatch(s):this.busy=!1}).catch(i=>{console.warn("OpenReplay:",i),this.retry(t)})}clean(){this.queue.length=0}}const tt="function"==typeof TextEncoder?new TextEncoder:{encode(t){const i=t.length,s=new Uint8Array(3*i);let e=-1;for(var n=0,r=0,h=0;h!==i;){if(n=t.charCodeAt(h),h+=1,n>=55296&&n<=56319){if(h===i){s[e+=1]=239,s[e+=1]=191,s[e+=1]=189;break}if(!((r=t.charCodeAt(h))>=56320&&r<=57343)){s[e+=1]=239,s[e+=1]=191,s[e+=1]=189;continue}if(h+=1,(n=1024*(n-55296)+r-56320+65536)>65535){s[e+=1]=240|n>>>18,s[e+=1]=128|n>>>12&63,s[e+=1]=128|n>>>6&63,s[e+=1]=128|63&n;continue}}n<=127?s[e+=1]=0|n:n<=2047?(s[e+=1]=192|n>>>6,s[e+=1]=128|63&n):(s[e+=1]=224|n>>>12,s[e+=1]=128|n>>>6&63,s[e+=1]=128|63&n)}return s.subarray(0,e+1)}};class it{constructor(t){this.size=t,this.offset=0,this.checkpointOffset=0,this.data=new Uint8Array(t)}checkpoint(){this.checkpointOffset=this.offset}isEmpty(){return 0===this.offset}boolean(t){return this.data[this.offset++]=+t,this.offset<=this.size}uint(t){for((t<0||t>Number.MAX_SAFE_INTEGER)&&(t=0);t>=128;)this.data[this.offset++]=t%256|128,t=Math.floor(t/128);return this.data[this.offset++]=t,this.offset<=this.size}int(t){return t=Math.round(t),this.uint(t>=0?2*t:-2*t-1)}string(t){const i=tt.encode(t),s=i.byteLength;return!(!this.uint(s)||this.offset+s>this.size)&&(this.data.set(i,this.offset),this.offset+=s,!0)}reset(){this.offset=0,this.checkpointOffset=0}flush(){const t=this.data.slice(0,this.checkpointOffset);return this.reset(),t}}class st{constructor(t,i,s){this.pageNo=t,this.timestamp=i,this.onBatch=s,this.nextIndex=0,this.beaconSize=2e5,this.writer=new it(this.beaconSize),this.isEmpty=!0,this.beaconSizeLimit=1e6,this.prepare()}prepare(){this.writer.isEmpty()&&new s(this.pageNo,this.nextIndex,this.timestamp).encode(this.writer)}write(t){const i=t.encode(this.writer);return i&&(this.isEmpty=!1,this.writer.checkpoint(),this.nextIndex++),i}setBeaconSizeLimit(t){this.beaconSizeLimit=t}writeMessage(t){for(t instanceof e&&(this.timestamp=t.timestamp);!this.write(t);){if(this.finaliseBatch(),this.beaconSize===this.beaconSizeLimit)return console.warn("OpenReplay: beacon size overflow. Skipping large message."),this.writer.reset(),this.prepare(),void(this.isEmpty=!0);this.beaconSize=Math.min(2*this.beaconSize,this.beaconSizeLimit),this.writer=new it(this.beaconSize),this.prepare(),this.isEmpty=!0}}finaliseBatch(){this.isEmpty||(this.onBatch(this.writer.flush()),this.prepare(),this.isEmpty=!0)}clean(){this.writer.reset()}}var et;!function(t){t[t.NotActive=0]="NotActive",t[t.Starting=1]="Starting",t[t.Stopping=2]="Stopping",t[t.Active=3]="Active"}(et||(et={}));let nt=null,rt=null,ht=et.NotActive;function ot(){rt&&rt.finaliseBatch()}function ct(){ht=et.Stopping,null!==ut&&(clearInterval(ut),ut=null),rt&&(rt.clean(),rt=null),ht=et.NotActive}let at,ut=null;self.onmessage=({data:t})=>{if(null!=t){if("stop"===t)return ot(),void ct();if(Array.isArray(t)){if(!rt)throw new Error("WebWorker: writer not initialised. Service Should be Started.");const s=rt;t.forEach(t=>{const e=new(i.get(t._id));Object.assign(e,t),e instanceof H&&(e.hidden?at=setTimeout(()=>self.postMessage("restart"),18e5):clearTimeout(at)),s.writeMessage(e)})}else{if("start"===t.type)return ht=et.Starting,nt=new Z(t.ingestPoint,()=>{self.postMessage("restart")},()=>{nt&&(nt.clean(),nt=null),ct(),self.postMessage("failed")},t.connAttemptCount,t.connAttemptGap),rt=new st(t.pageNo,t.timestamp,t=>nt&&nt.push(t)),null===ut&&(ut=setInterval(ot,1e4)),ht=et.Active;if("auth"===t.type){if(!nt)throw new Error("WebWorker: sender not initialised. Received auth.");if(!rt)throw new Error("WebWorker: writer not initialised. Received auth.");return nt.authorise(t.token),void(t.beaconSizeLimit&&rt.setBeaconSizeLimit(t.beaconSizeLimit))}}}else ot()};
`], { type: 'text/javascript' })));
            this.worker.onerror = e => {
                this._debug("webworker_error", e);
            };
            this.worker.onmessage = ({ data }) => {
                if (data === "failed") {
                    this.stop();
                    this._debug("worker_failed", {}); // add context (from worker)
                }
                else if (data === "restart") {
                    this.stop();
                    this.start({ forceNew: true });
                }
            };
            const alertWorker = () => {
                if (this.worker) {
                    this.worker.postMessage(null);
                }
            };
            // keep better tactics, discard others?
            this.attachEventListener(window, 'beforeunload', alertWorker, false);
            this.attachEventListener(document.body, 'mouseleave', alertWorker, false, false);
            // TODO: stop session after inactivity timeout (make configurable)
            this.attachEventListener(document, 'visibilitychange', alertWorker, false);
        }
        catch (e) {
            this._debug("worker_start", e);
        }
    }
    _debug(context, e) {
        if (this.options.__debug_report_edp !== null) {
            fetch(this.options.__debug_report_edp, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context,
                    error: `${e}`
                })
            });
        }
        this.debug.error("OpenReplay error: ", context, e);
    }
    send(message, urgent = false) {
        if (this.activityState === ActivityState.NotActive) {
            return;
        }
        this.messages.push(message);
        // TODO: commit on start if there were `urgent` sends;
        // Clearify where urgent can be used for;
        // Clearify workflow for each type of message in case it was sent before start
        //      (like Fetch before start; maybe add an option "preCapture: boolean" or sth alike)
        if (this.activityState === ActivityState.Active && urgent) {
            this.commit();
        }
    }
    commit() {
        if (this.worker && this.messages.length) {
            this.messages.unshift(new Timestamp(timestamp()));
            this.worker.postMessage(this.messages);
            this.commitCallbacks.forEach(cb => cb(this.messages));
            this.messages.length = 0;
        }
    }
    safe(fn) {
        const app = this;
        return function (...args) {
            try {
                fn.apply(this, args);
            }
            catch (e) {
                app._debug("safe_fn_call", e);
                // time: timestamp(),
                // name: e.name,
                // message: e.message,
                // stack: e.stack
            }
        }; // TODO: correct typing
    }
    attachCommitCallback(cb) {
        this.commitCallbacks.push(cb);
    }
    attachStartCallback(cb) {
        this.startCallbacks.push(cb);
    }
    attachStopCallback(cb) {
        this.stopCallbacks.push(cb);
    }
    attachEventListener(target, type, listener, useSafe = true, useCapture = true) {
        if (useSafe) {
            listener = this.safe(listener);
        }
        this.attachStartCallback(() => target.addEventListener(type, listener, useCapture));
        this.attachStopCallback(() => target.removeEventListener(type, listener, useCapture));
    }
    // TODO: full correct semantic
    checkRequiredVersion(version) {
        const reqVer = version.split(/[.-]/);
        const ver = this.version.split(/[.-]/);
        for (let i = 0; i < 3; i++) {
            if (Number(ver[i]) < Number(reqVer[i]) || isNaN(Number(ver[i])) || isNaN(Number(reqVer[i]))) {
                return false;
            }
        }
        return true;
    }
    getStartInfo() {
        return {
            userUUID: this.localStorage.getItem(this.options.local_uuid_key),
            projectKey: this.projectKey,
            revID: this.revID,
            timestamp: timestamp(),
            trackerVersion: this.version,
            isSnippet: this.options.__is_snippet,
        };
    }
    getSessionInfo() {
        return Object.assign(Object.assign({}, this.session.getInfo()), this.getStartInfo());
    }
    getSessionToken() {
        const token = this.sessionStorage.getItem(this.options.session_token_key);
        if (token !== null) {
            return token;
        }
    }
    getSessionID() {
        return this.session.getInfo().sessionID || undefined;
    }
    getHost() {
        return new URL(this.options.ingestPoint).hostname;
    }
    getProjectKey() {
        return this.projectKey;
    }
    getBaseHref() {
        var _a, _b;
        if (typeof this.options.resourceBaseHref === 'string') {
            return this.options.resourceBaseHref;
        }
        else if (typeof this.options.resourceBaseHref === 'object') {
            //switch between  types
        }
        if (document.baseURI) {
            return document.baseURI;
        }
        // IE only
        return ((_b = (_a = document.head) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("base")[0]) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) || location.origin + location.pathname;
    }
    resolveResourceURL(resourceURL) {
        const base = new URL(this.getBaseHref());
        base.pathname += "/" + new URL(resourceURL).pathname;
        base.pathname.replace(/\/+/g, "/");
        return base.toString();
    }
    isServiceURL(url) {
        return url.startsWith(this.options.ingestPoint);
    }
    active() {
        return this.activityState === ActivityState.Active;
    }
    resetNextPageSession(flag) {
        if (flag) {
            this.sessionStorage.setItem(this.options.session_reset_key, 't');
        }
        else {
            this.sessionStorage.removeItem(this.options.session_reset_key);
        }
    }
    _start(startOpts) {
        if (!this.worker) {
            return Promise.resolve(UnsuccessfulStart("No worker found: perhaps, CSP is not set."));
        }
        if (this.activityState !== ActivityState.NotActive) {
            return Promise.resolve(UnsuccessfulStart("OpenReplay: trying to call `start()` on the instance that has been started already."));
        }
        this.activityState = ActivityState.Starting;
        let pageNo = 0;
        const pageNoStr = this.sessionStorage.getItem(this.options.session_pageno_key);
        if (pageNoStr != null) {
            pageNo = parseInt(pageNoStr);
            pageNo++;
        }
        this.sessionStorage.setItem(this.options.session_pageno_key, pageNo.toString());
        const startInfo = this.getStartInfo();
        const startWorkerMsg = {
            type: "start",
            pageNo,
            ingestPoint: this.options.ingestPoint,
            timestamp: startInfo.timestamp,
            connAttemptCount: this.options.connAttemptCount,
            connAttemptGap: this.options.connAttemptGap,
        };
        this.worker.postMessage(startWorkerMsg);
        this.session.update({
            // "updating" with old metadata in order to trigger session's UpdateCallbacks.
            // (for the case of internal .start() calls, like on "restart" webworker signal or assistent connection in tracker-assist )
            metadata: startOpts.metadata || this.session.getInfo().metadata,
            userID: startOpts.userID,
        });
        const sReset = this.sessionStorage.getItem(this.options.session_reset_key);
        this.sessionStorage.removeItem(this.options.session_reset_key);
        return window.fetch(this.options.ingestPoint + '/v1/web/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.assign(Object.assign({}, startInfo), { userID: this.session.getInfo().userID, token: this.sessionStorage.getItem(this.options.session_token_key), deviceMemory,
                jsHeapSizeLimit, reset: startOpts.forceNew || sReset !== null })),
        })
            .then(r => {
            if (r.status === 200) {
                return r.json();
            }
            else {
                return r.text().then(text => text === CANCELED
                    ? Promise.reject(CANCELED)
                    : Promise.reject(`Server error: ${r.status}. ${text}`));
            }
        })
            .then(r => {
            if (!this.worker) {
                return Promise.reject("no worker found after start request (this might not happen)");
            }
            const { token, userUUID, sessionID, beaconSizeLimit } = r;
            if (typeof token !== 'string' ||
                typeof userUUID !== 'string' ||
                (typeof beaconSizeLimit !== 'number' && typeof beaconSizeLimit !== 'undefined')) {
                return Promise.reject(`Incorrect server response: ${JSON.stringify(r)}`);
            }
            this.sessionStorage.setItem(this.options.session_token_key, token);
            this.localStorage.setItem(this.options.local_uuid_key, userUUID);
            this.session.update({ sessionID }); // TODO: no no-explicit 'any'
            const startWorkerMsg = {
                type: "auth",
                token,
                beaconSizeLimit
            };
            this.worker.postMessage(startWorkerMsg);
            this.activityState = ActivityState.Active;
            const onStartInfo = { sessionToken: token, userUUID, sessionID };
            this.startCallbacks.forEach((cb) => cb(onStartInfo)); // TODO: start as early as possible (before receiving the token)
            this.observer.observe();
            this.ticker.start();
            this.notify.log("OpenReplay tracking started.");
            // get rid of onStart ?
            if (typeof this.options.onStart === 'function') {
                this.options.onStart(onStartInfo);
            }
            return SuccessfulStart(onStartInfo);
        })
            .catch(reason => {
            this.sessionStorage.removeItem(this.options.session_token_key);
            this.stop();
            if (reason === CANCELED) {
                return UnsuccessfulStart(CANCELED);
            }
            this.notify.log("OpenReplay was unable to start. ", reason);
            this._debug("session_start", reason);
            return UnsuccessfulStart(START_ERROR);
        });
    }
    start(options = {}) {
        if (!document.hidden) {
            return this._start(options);
        }
        else {
            return new Promise((resolve) => {
                const onVisibilityChange = () => {
                    if (!document.hidden) {
                        document.removeEventListener("visibilitychange", onVisibilityChange);
                        resolve(this._start(options));
                    }
                };
                document.addEventListener("visibilitychange", onVisibilityChange);
            });
        }
    }
    stop(calledFromAPI = false) {
        if (this.activityState !== ActivityState.NotActive) {
            try {
                this.sanitizer.clear();
                this.observer.disconnect();
                this.nodes.clear();
                this.ticker.stop();
                this.stopCallbacks.forEach((cb) => cb());
                if (calledFromAPI) {
                    this.session.reset();
                }
                this.notify.log("OpenReplay tracking stopped.");
                if (this.worker) {
                    this.worker.postMessage("stop");
                }
            }
            finally {
                this.activityState = ActivityState.NotActive;
            }
        }
    }
}
