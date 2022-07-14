import { classes, SetPageVisibility, } from "../common/messages.js";
import QueueSender from "./QueueSender.js";
import BatchWriter from "./BatchWriter.js";
var WorkerStatus;
(function (WorkerStatus) {
    WorkerStatus[WorkerStatus["NotActive"] = 0] = "NotActive";
    WorkerStatus[WorkerStatus["Starting"] = 1] = "Starting";
    WorkerStatus[WorkerStatus["Stopping"] = 2] = "Stopping";
    WorkerStatus[WorkerStatus["Active"] = 3] = "Active";
})(WorkerStatus || (WorkerStatus = {}));
const AUTO_SEND_INTERVAL = 10 * 1000;
let sender = null;
let writer = null;
let workerStatus = WorkerStatus.NotActive;
function send() {
    if (!writer) {
        return;
    }
    writer.finaliseBatch();
}
function reset() {
    workerStatus = WorkerStatus.Stopping;
    if (sendIntervalID !== null) {
        clearInterval(sendIntervalID);
        sendIntervalID = null;
    }
    if (writer) {
        writer.clean();
        writer = null;
    }
    workerStatus = WorkerStatus.NotActive;
}
function resetCleanQueue() {
    if (sender) {
        sender.clean();
        sender = null;
    }
    reset();
}
let sendIntervalID = null;
let restartTimeoutID;
self.onmessage = ({ data }) => {
    if (data == null) {
        send(); // TODO: sendAll?
        return;
    }
    if (data === "stop") {
        send();
        reset();
        return;
    }
    if (Array.isArray(data)) {
        if (!writer) {
            throw new Error("WebWorker: writer not initialised. Service Should be Started.");
        }
        const w = writer;
        // Message[]
        data.forEach((data) => {
            const message = new (classes.get(data._id))();
            Object.assign(message, data);
            if (message instanceof SetPageVisibility) {
                if (message.hidden) {
                    restartTimeoutID = setTimeout(() => self.postMessage("restart"), 30 * 60 * 1000);
                }
                else {
                    clearTimeout(restartTimeoutID);
                }
            }
            w.writeMessage(message);
        });
        return;
    }
    if (data.type === 'start') {
        workerStatus = WorkerStatus.Starting;
        sender = new QueueSender(data.ingestPoint, () => {
            self.postMessage("restart");
        }, () => {
            resetCleanQueue();
            self.postMessage("failed");
        }, data.connAttemptCount, data.connAttemptGap);
        writer = new BatchWriter(data.pageNo, data.timestamp, 
        // onBatch
        batch => sender && sender.push(batch));
        if (sendIntervalID === null) {
            sendIntervalID = setInterval(send, AUTO_SEND_INTERVAL);
        }
        return workerStatus = WorkerStatus.Active;
    }
    if (data.type === "auth") {
        if (!sender) {
            throw new Error("WebWorker: sender not initialised. Received auth.");
        }
        if (!writer) {
            throw new Error("WebWorker: writer not initialised. Received auth.");
        }
        sender.authorise(data.token);
        data.beaconSizeLimit && writer.setBeaconSizeLimit(data.beaconSizeLimit);
        return;
    }
};
