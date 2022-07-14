export default class PrimitiveWriter {
    private readonly size;
    private offset;
    private checkpointOffset;
    private readonly data;
    constructor(size: number);
    checkpoint(): void;
    isEmpty(): boolean;
    boolean(value: boolean): boolean;
    uint(value: number): boolean;
    int(value: number): boolean;
    string(value: string): boolean;
    reset(): void;
    flush(): Uint8Array;
}
