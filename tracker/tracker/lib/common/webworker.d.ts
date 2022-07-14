export interface Options {
    connAttemptCount?: number;
    connAttemptGap?: number;
}
declare type Start = {
    type: "start";
    ingestPoint: string;
    pageNo: number;
    timestamp: number;
} & Options;
declare type Auth = {
    type: "auth";
    token: string;
    beaconSizeLimit?: number;
};
export declare type WorkerMessageData = null | "stop" | Start | Auth | Array<{
    _id: number;
}>;
export {};
