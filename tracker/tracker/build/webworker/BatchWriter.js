import PrimitiveWriter from "./PrimitiveWriter.js";
import { BatchMeta, Timestamp, } from "../common/messages.js";
export default class BatchWriter {
    constructor(pageNo, timestamp, onBatch) {
        this.pageNo = pageNo;
        this.timestamp = timestamp;
        this.onBatch = onBatch;
        this.nextIndex = 0;
        this.beaconSize = 2 * 1e5; // Default 200kB
        this.writer = new PrimitiveWriter(this.beaconSize);
        this.isEmpty = true;
        this.beaconSizeLimit = 1e6;
        this.prepare();
    }
    prepare() {
        if (!this.writer.isEmpty()) {
            return;
        }
        new BatchMeta(this.pageNo, this.nextIndex, this.timestamp).encode(this.writer);
    }
    write(message) {
        const wasWritten = message.encode(this.writer);
        if (wasWritten) {
            this.isEmpty = false;
            this.writer.checkpoint();
            this.nextIndex++;
        }
        return wasWritten;
    }
    setBeaconSizeLimit(limit) {
        this.beaconSizeLimit = limit;
    }
    writeMessage(message) {
        if (message instanceof Timestamp) {
            this.timestamp = message.timestamp;
        }
        while (!this.write(message)) {
            this.finaliseBatch();
            if (this.beaconSize === this.beaconSizeLimit) {
                console.warn("OpenReplay: beacon size overflow. Skipping large message.");
                this.writer.reset();
                this.prepare();
                this.isEmpty = true;
                return;
            }
            // MBTODO: tempWriter for one message?
            this.beaconSize = Math.min(this.beaconSize * 2, this.beaconSizeLimit);
            this.writer = new PrimitiveWriter(this.beaconSize);
            this.prepare();
            this.isEmpty = true;
        }
    }
    finaliseBatch() {
        if (this.isEmpty) {
            return;
        }
        this.onBatch(this.writer.flush());
        this.prepare();
        this.isEmpty = true;
    }
    clean() {
        this.writer.reset();
    }
}
