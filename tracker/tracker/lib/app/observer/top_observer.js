import Observer from "./observer.js";
import { isElementNode, hasTag, } from "../guards.js";
import IFrameObserver from "./iframe_observer.js";
import ShadowRootObserver from "./shadow_root_observer.js";
import { CreateDocument } from "../../common/messages.js";
import { IN_BROWSER, hasOpenreplayAttribute } from '../../utils.js';
const attachShadowNativeFn = IN_BROWSER ? Element.prototype.attachShadow : () => new ShadowRoot();
export default class TopObserver extends Observer {
    constructor(app, options) {
        super(app, true);
        this.iframeObservers = [];
        this.shadowRootObservers = [];
        this.options = Object.assign({
            captureIFrames: true
        }, options);
        // IFrames
        this.app.nodes.attachNodeCallback(node => {
            if (hasTag(node, "IFRAME") &&
                ((this.options.captureIFrames && !hasOpenreplayAttribute(node, "obscured"))
                    || hasOpenreplayAttribute(node, "capture"))) {
                this.handleIframe(node);
            }
        });
        // ShadowDOM
        this.app.nodes.attachNodeCallback(node => {
            if (isElementNode(node) && node.shadowRoot !== null) {
                this.handleShadowRoot(node.shadowRoot);
            }
        });
    }
    handleIframe(iframe) {
        let doc = null;
        const handle = this.app.safe(() => {
            const id = this.app.nodes.getID(iframe);
            if (id === undefined) {
                return;
            } //log
            if (iframe.contentDocument === doc) {
                return;
            } // How frequently can it happen?
            doc = iframe.contentDocument;
            if (!doc || !iframe.contentWindow) {
                return;
            }
            const observer = new IFrameObserver(this.app);
            this.iframeObservers.push(observer);
            observer.observe(iframe);
        });
        iframe.addEventListener("load", handle); // why app.attachEventListener not working?
        handle();
    }
    handleShadowRoot(shRoot) {
        const observer = new ShadowRootObserver(this.app);
        this.shadowRootObservers.push(observer);
        observer.observe(shRoot.host);
    }
    observe() {
        // Protection from several subsequent calls?
        const observer = this;
        Element.prototype.attachShadow = function () {
            const shadow = attachShadowNativeFn.apply(this, arguments);
            observer.handleShadowRoot(shadow);
            return shadow;
        };
        // Can observe documentElement (<html>) here, because it is not supposed to be changing.
        // However, it is possible in some exotic cases and may cause an ignorance of the newly created <html>
        // In this case context.document have to be observed, but this will cause 
        // the change in the re-player behaviour caused by CreateDocument message: 
        //   the 0-node ("fRoot") will become #document rather than documentElement as it is now.
        // Alternatively - observe(#document) then bindNode(documentElement)
        this.observeRoot(window.document, () => {
            this.app.send(new CreateDocument());
        }, window.document.documentElement);
    }
    disconnect() {
        Element.prototype.attachShadow = attachShadowNativeFn;
        this.iframeObservers.forEach(o => o.disconnect());
        this.iframeObservers = [];
        this.shadowRootObservers.forEach(o => o.disconnect());
        this.shadowRootObservers = [];
        super.disconnect();
    }
}
