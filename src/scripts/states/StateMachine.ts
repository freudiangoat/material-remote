import { ModuleID } from "../constants.js";
import { debug } from "../debug.js";
import { PingMsg, PongMsg } from "../msg/PingMsg.js";
import { StateMenuConfig } from "../settings/stateMenuForm.js";
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

        this.states[this.state].activate();

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

    pushState(name: string) {
        debug(`pushing state ${name}`);
        this.stateStack.push(this.state);
        this.state = name;
        this.states[name].activate();
    }

    popState() {
        if (this.stateStack.length > 0) {
            this.state = this.stateStack.pop();
            debug(`popping back to state ${this.state}`);
            this.states[this.state].activate();
        }
    }
}

export function initializeStateMachine() {
    StateManager = new StateMachine();
}

export var StateManager: StateMachine;