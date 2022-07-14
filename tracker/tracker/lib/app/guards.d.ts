export declare function isSVGElement(node: Element): node is SVGElement;
export declare function isElementNode(node: Node): node is Element;
export declare function isTextNode(node: Node): node is Text;
export declare function isRootNode(node: Node): boolean;
declare type TagTypeMap = {
    HTML: HTMLHtmlElement;
    IMG: HTMLImageElement;
    INPUT: HTMLInputElement;
    TEXTAREA: HTMLTextAreaElement;
    SELECT: HTMLSelectElement;
    LABEL: HTMLLabelElement;
    IFRAME: HTMLIFrameElement;
    STYLE: HTMLStyleElement;
    style: SVGStyleElement;
    LINK: HTMLLinkElement;
};
export declare function hasTag<T extends keyof TagTypeMap>(el: Node, tagName: T): el is TagTypeMap[typeof tagName];
export {};
