export default class QueueSender {
    private readonly onUnauthorised;
    private readonly onFailure;
    private readonly MAX_ATTEMPTS_COUNT;
    private readonly ATTEMPT_TIMEOUT;
    private attemptsCount;
    private busy;
    private readonly queue;
    private readonly ingestURL;
    private token;
    constructor(ingestBaseURL: string, onUnauthorised: Function, onFailure: Function, MAX_ATTEMPTS_COUNT?: number, ATTEMPT_TIMEOUT?: number);
    authorise(token: string): void;
    push(batch: Uint8Array): void;
    private retry;
    private sendBatch;
    clean(): void;
}
