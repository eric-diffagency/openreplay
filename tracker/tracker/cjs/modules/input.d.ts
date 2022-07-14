import type App from "../app/index.js";
declare type TextEditableElement = HTMLInputElement | HTMLTextAreaElement;
export declare function getInputLabel(node: TextEditableElement): string;
export declare const enum InputMode {
    Plain = 0,
    Obscured = 1,
    Hidden = 2
}
export interface Options {
    obscureInputNumbers: boolean;
    obscureInputEmails: boolean;
    defaultInputMode: InputMode;
    obscureInputDates: boolean;
}
export default function (app: App, opts: Partial<Options>): void;
export {};
