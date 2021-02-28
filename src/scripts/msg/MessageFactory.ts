import { ConnectMsg } from "./ConnectMsg.js";
import { ButtonMsg } from "./ButtonMsg.js";
import { PingMsg, PongMsg } from "./PingMsg.js";
import { AnalogMsg } from "./AnalogMsg.js";

const messageTypes: Record<string, any> = {};

function registerMessage(t: any) {
    messageTypes[t.id] = t;
}

registerMessage(ConnectMsg);
registerMessage(PingMsg);
registerMessage(PongMsg);
registerMessage(ButtonMsg);
registerMessage(AnalogMsg);

export function parseMessage(msg: string): IMsg | null {
    const parsed = JSON.parse(msg);

    const id = parsed.type as string;
    const messageType = messageTypes[id];

    if (!messageType) {
        return null;
    }

    return Object.assign(
        Object.create(messageType.prototype),
        parsed);
}