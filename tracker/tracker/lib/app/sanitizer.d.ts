import type App from "./index.js";
export interface Options {
    obscureTextEmails: boolean;
    obscureTextNumbers: boolean;
}
export default class Sanitizer {
    private readonly app;
    private readonly masked;
    private readonly maskedContainers;
    private readonly options;
    constructor(app: App, options: Partial<Options>);
    handleNode(id: number, parentID: number, node: Node): void;
    sanitize(id: number, data: string): string;
    isMasked(id: number): boolean;
    isMaskedContainer(id: number): boolean;
    getInnerTextSecure(el: HTMLElement): string;
    clear(): void;
}
