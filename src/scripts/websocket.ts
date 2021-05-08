import { ModuleID, ModuleName, Tag } from "./constants.js";
import { debug } from "./debug.js";
import { ConnectMsg } from "./msg/ConnectMsg.js";
import { parseMessage } from "./msg/MessageFactory.js";
import { PingMsg } from "./msg/PingMsg.js";
import { StateManager } from "./states/StateMachine.js";

var ws: WebSocket;
var wsResetInterval: NodeJS.Timeout;
var wsPingInterval: NodeJS.Timeout;
var WSClientConnected: boolean

export function startWebsocket() {
    const address = game.settings.get(ModuleID, 'address') as string;
    const parsedUrl = new URL(address);
    var url = address;
    
    if (parsedUrl.protocol !== "wss:" && parsedUrl.protocol !== "ws:")
    {
        parsedUrl.protocol = parsedUrl.protocol.endsWith("s:")
            ? "wss:"
            : "ws:";

        url = parsedUrl.toString();
    }

    try {
        ws = new WebSocket(url);
    }
    catch {
    }

    ws.onmessage = incomingMessage;
    ws.onopen = connectionOpened;
    ws.onerror = connectionError;
    ws.onclose = connectionClosed;

    resetPingTimeout();
    resetTimeout(10000);
}

function connectionError(evt: Event) {
    debug("Connection error", evt)
}

function connectionClosed(evt: CloseEvent) {
    debug("Connection closed.");
}

function resetWebsocket(): void {
    debug("Connection timed out, resetting.");

    if (WSClientConnected) {
        ui.notifications.warn(game.i18n.localize("MaterialRemote.Notify.ConnectionLost"));

        try
        {
            ws.close();
        }
        catch
        {
            debug("Failed to close previous connection.");
        }
    } else {
        ui.notifications.warn(game.i18n.localize("MaterialRemote.Notify.ConnectionFailed"));
    }

    WSClientConnected = false;
    startWebsocket();
}

function connectionOpened(): void {
    WSClientConnected = true;
    ui.notifications.info(game.i18n.localize("MaterialRemote.Notify.Connected"));

    debug("Connected to server. Sending identification.");
    const connect = new ConnectMsg(`${ModuleID}:${game.modules.get(ModuleID).data.version}`);
    ws.send(JSON.stringify(connect));

    StateManager.reactivate();

    resetTimeout();
}

function incomingMessage(evt: MessageEvent<string>): Promise<any> {
    resetTimeout();
    var msg = parseMessage(evt.data);

    if (!msg) {
        debug(`Received unsupported message: ${evt.data}`)
        return;
    }

    return StateManager.handleMessage(msg);
}

function ping() {
    sendMessage(new PingMsg());
}

export function sendMessage(msg: IMsg): void {
    if (!WSClientConnected) {
        return;
    }

    if (ws.readyState === WebSocket.CLOSED || ws.readyState == WebSocket.CLOSING) {
        resetWebsocket();
        return;
    }

    ws.send(JSON.stringify(msg));
}

function resetTimeout(timeout: number = 5000) {
    clearInterval(wsResetInterval);
    wsResetInterval = setInterval(resetWebsocket, timeout);
}

function resetPingTimeout() {
    clearInterval(wsPingInterval);
    wsPingInterval = setInterval(ping, 2500);
}