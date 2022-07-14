declare type NodeCallback = (node: Node, isStart: boolean) => void;
export default class Nodes {
    private readonly node_id;
    private readonly nodes;
    private readonly nodeCallbacks;
    private readonly elementListeners;
    constructor(node_id: string);
    attachNodeCallback(nodeCallback: NodeCallback): void;
    attachElementListener(type: string, node: Element, elementListener: EventListener): void;
    registerNode(node: Node): [id: number, isNew: boolean];
    unregisterNode(node: Node): number | undefined;
    callNodeCallbacks(node: Node, isStart: boolean): void;
    getID(node: Node): number | undefined;
    getNode(id: number): Node | undefined;
    clear(): void;
}
export {};
