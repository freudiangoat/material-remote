import { ModuleID } from "../constants.js";
import { debug } from "../debug.js";
import { ButtonMsg } from "../msg/ButtonMsg.js";
import { parseMessage } from "../msg/MessageFactory.js";
import { PingMsg, PongMsg } from "../msg/PingMsg.js";
import { SetBindingsMsg } from "../msg/SetBindingsMsg.js";
import { StateMenuConfig, StateConfig } from "../settings/stateMenuForm.js";
import { sendMessage } from "../websocket.js";
import { ConfigState } from "./ConfigState.js";
import { IState } from "./IState.js";
import { SimpleState } from "./SimpleState.js";

class StateMachine {
    private state: string
    private states: Record<string, IState>
    private stateStack: string[]

    constructor() {
        const settings = game.settings.get(ModuleID, 'stateConfigs') as StateMenuConfig;

        var stateList = settings.states.map(sc => {
            return new SimpleState(sc.name);
        })

        this.state = stateList[0].name;
        this.states = {};

        stateList.forEach(s => {
            this.states[s.name] = s;
        });

        this.stateChange(this.state);

        this.states["_config"] = new ConfigState();
        this.stateStack = [];
    }

    async handleMessage(msg: IMsg): Promise<any> {
        if (msg.type === PingMsg.id || msg.type === PongMsg.id) {
            return;
        }

        return await this.states[this.state].handleMessage(msg);
    }

    getCurrentState(): IState {
        return this.states[this.state];
    }

    reactivate(): Promise<any> {
        return this.stateChange(this.state);
    }

    pushState(name: string) {
        debug(`pushing state ${name}`);
        this.stateStack.push(this.state);
        this.state = name;
        this.stateChange(name);
    }

    popState() {
        if (this.stateStack.length > 0) {
            debug(`popping back to state ${this.state}`);
            this.stateChange(this.stateStack.pop());
        }
    }

    private async stateChange(newStateName: string): Promise<any> {
        const oldState = this.states[this.state];
        const newState = this.states[newStateName];

        if (oldState) {
            await oldState.deactivate();
        }

        await newState.activate();

        this.state = newStateName;

        const settings = game.settings.get(ModuleID, "stateConfigs") as StateMenuConfig;
        const currentStateSettings = settings.states.find(s => s.name === newState.name);

        if (!currentStateSettings)
        {
            return;
        }

        const boundButtons = currentStateSettings.mappings.map(m => parseMessage(m.msg))
            .filter(m => m instanceof ButtonMsg)
            .map(m => (m as ButtonMsg).name);

        sendMessage(new SetBindingsMsg(boundButtons));
    }
}

export function initializeStateMachine() {
    StateManager = new StateMachine();
}

export var StateManager: StateMachine;