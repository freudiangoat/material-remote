import { ModuleID } from "../constants.js";
import { SetBindingsMsg } from "../msg/SetBindingsMsg.js";
import { StateMenuConfig } from "../settings/stateMenuForm.js";
import { sendMessage } from "../websocket.js";
import { IState } from "./IState.js";

export class ConfigState implements IState {
    name: string;
    private listener: (msg: IMsg) => void;

    async handleMessage(msg: IMsg): Promise<any> {
        if (this.listener !== null) 
        {
            this.listener(msg);
        }
    }

    async activate(): Promise<void> {
        this.listener = null;
    }

    async deactivate(): Promise<void> {
    }

    setListener(listener: (msg: IMsg) => void) {
        this.listener = listener;
    }
}