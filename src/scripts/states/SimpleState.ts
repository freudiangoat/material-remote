import { ModuleID } from "../constants.js";
import { debug } from "../debug.js";
import { HandlerDispatcher } from "../handlers/HandlerManager.js";
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

    async deactivate(): Promise<void> {
    }

    async handleMessage(msg: IMsg): Promise<any> {
        const mapping = this.config?.mappings.find(m => m.event === msg.toString());

        HandlerDispatcher.handle(mapping);
    }
}