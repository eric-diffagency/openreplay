const INGEST_PATH = "/v1/web/i";
const KEEPALIVE_SIZE_LIMIT = 64 << 10; // 64 kB
// function sendXHR(url: string, token: string, batch: Uint8Array): Promise<XMLHttpRequest> {
//   const req = new XMLHttpRequest()
//   req.open("POST", url)
//   req.setRequestHeader("Authorization", "Bearer " + token)
//   return new Promise((res, rej) => {
//     req.onreadystatechange = function() {
//       if (this.readyState === 4) {
//         if (this.status == 0) {
//           return; // happens simultaneously with onerror
//         }
//         res(this)
//       }
//     }
//     req.onerror = rej
//     req.send(batch.buffer)
//   })
// }
export default class QueueSender {
    constructor(ingestBaseURL, onUnauthorised, onFailure, MAX_ATTEMPTS_COUNT = 10, ATTEMPT_TIMEOUT = 1000) {
        this.onUnauthorised = onUnauthorised;
        this.onFailure = onFailure;
        this.MAX_ATTEMPTS_COUNT = MAX_ATTEMPTS_COUNT;
        this.ATTEMPT_TIMEOUT = ATTEMPT_TIMEOUT;
        this.attemptsCount = 0;
        this.busy = false;
        this.queue = [];
        this.token = null;
        this.ingestURL = ingestBaseURL + INGEST_PATH;
    }
    authorise(token) {
        this.token = token;
    }
    push(batch) {
        if (this.busy || !this.token) {
            this.queue.push(batch);
        }
        else {
            this.sendBatch(batch);
        }
    }
    retry(batch) {
        if (this.attemptsCount >= this.MAX_ATTEMPTS_COUNT) {
            this.onFailure();
            return;
        }
        this.attemptsCount++;
        setTimeout(() => this.sendBatch(batch), this.ATTEMPT_TIMEOUT * this.attemptsCount);
    }
    // would be nice to use Beacon API, but it is not available in WebWorker
    sendBatch(batch) {
        this.busy = true;
        fetch(this.ingestURL, {
            body: batch,
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.token,
                //"Content-Type": "",
            },
            keepalive: batch.length < KEEPALIVE_SIZE_LIMIT,
        })
            .then(r => {
            if (r.status === 401) { // TODO: continuous session ?
                this.busy = false;
                this.onUnauthorised();
                return;
            }
            else if (r.status >= 400) {
                this.retry(batch);
                return;
            }
            // Success
            this.attemptsCount = 0;
            const nextBatch = this.queue.shift();
            if (nextBatch) {
                this.sendBatch(nextBatch);
            }
            else {
                this.busy = false;
            }
        })
            .catch(e => {
            console.warn("OpenReplay:", e);
            this.retry(batch);
        });
    }
    clean() {
        this.queue.length = 0;
    }
}
