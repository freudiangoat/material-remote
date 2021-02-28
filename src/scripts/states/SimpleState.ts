import { ModuleID } from "../constants.js";
import { debug } from "../debug.js";
import { ButtonMsg } from "../msg/ButtonMsg.js";
import { StateConfig, StateMenuConfig } from "../settings/stateMenuForm.js";
import { IState } from "./IState.js";

export class SimpleState implements IState {
    name: string;
    config: StateConfig;

    constructor(name: string) {
        this.name = name;
    }

    async activate(): Promise<void> {
        const mappings = await game.settings.get(ModuleID, "stateConfigs") as StateMenuConfig;
        this.config = mappings.states.find(s => s.name === this.name);
    }

    async handleMessage(msg: IMsg): Promise<any> {
        debug(`state ${this.name} received message`, msg);

        const mapping = this.config?.mappings.find(m => m.event === msg.toString());
        if (!mapping?.macro) {
            return;
        }

        const macro = game.macros.get(mapping?.macro);
        macro?.execute();
    }
}