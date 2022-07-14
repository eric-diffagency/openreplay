import { LongTask } from "../common/messages.js";
;
;
export default function (app) {
    if (!('PerformanceObserver' in window) || !('PerformanceLongTaskTiming' in window)) {
        return;
    }
    const contexts = ["unknown", "self", "same-origin-ancestor", "same-origin-descendant", "same-origin", "cross-origin-ancestor", "cross-origin-descendant", "cross-origin-unreachable", "multiple-contexts"];
    const containerTypes = ["window", "iframe", "embed", "object"];
    function longTask(entry) {
        let type = "", src = "", id = "", name = "";
        const container = entry.attribution[0];
        if (container != null) {
            type = container.containerType;
            name = container.containerName;
            id = container.containerId;
            src = container.containerSrc;
        }
        app.send(new LongTask(entry.startTime + performance.timing.navigationStart, entry.duration, Math.max(contexts.indexOf(entry.name), 0), Math.max(containerTypes.indexOf(type), 0), name, id, src));
    }
    const observer = new PerformanceObserver((list) => list.getEntries().forEach(longTask));
    observer.observe({ entryTypes: ['longtask'] });
}
