import type Message from "../common/messages.js";
export default class BatchWriter {
    private readonly pageNo;
    private timestamp;
    private onBatch;
    private nextIndex;
    private beaconSize;
    private writer;
    private isEmpty;
    constructor(pageNo: number, timestamp: number, onBatch: (batch: Uint8Array) => void);
    private prepare;
    private write;
    private beaconSizeLimit;
    setBeaconSizeLimit(limit: number): void;
    writeMessage(message: Message): void;
    finaliseBatch(): void;
    clean(): void;
}
