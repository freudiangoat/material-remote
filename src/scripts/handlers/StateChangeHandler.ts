import { ButtonMsg } from "../msg/ButtonMsg.js";
import { StateConfigData } from "../settings/stateMenuForm.js";
import { ConfigState } from "../states/ConfigState.js";
import { StateManager } from "../states/StateMachine.js";
import { IMappingHandler } from "./IMappingHandler.js";

export class StateChangeHandler implements IMappingHandler {
    static id = "state_change";

    type: string;

    constructor() {
        this.type = StateChangeHandler.id;
    }

    supportsMessage(msg: IMsg): boolean {
        return msg instanceof ButtonMsg;
    }

    handle(msg: IMsg, value: string): void {
        StateManager.changeState(value);
    }

    augmentSettings(original: StateConfigData): StateConfigData {
        return {
            ...original,
            types: [
                ...original.types,
                {
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.States"),
                    id: this.type,
                    supportsMessage: this.supportsMessage
                }
            ],
            [this.type]: StateManager.getAllStates()
                .filter(s => s.name)
                .map(s => {
                    return {
                        _id: s.name,
                        name: s.name,
                    };
                }),
        }
    }

    getDefault(): string {
        const currentState = StateManager.getCurrentState();
        if (currentState instanceof ConfigState) {
            return StateManager.peekState().name;
        }

        return currentState.name;
    }
}