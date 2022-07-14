import { ConnectionInformation } from "../common/messages.js";
export default function (app) {
    const connection = navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
    if (connection === undefined) {
        return;
    }
    const sendConnectionInformation = () => app.send(new ConnectionInformation(Math.round(connection.downlink * 1000), connection.type || 'unknown'));
    sendConnectionInformation();
    connection.addEventListener('change', sendConnectionInformation);
}
