import { ModuleID } from "../constants.js";
import { debug } from "../debug.js";
import { ButtonMsg } from "../msg/ButtonMsg.js";
import { parseMessage } from "../msg/MessageFactory.js";
import { PingMsg, PongMsg } from "../msg/PingMsg.js";
import { SetBindingsMsg } from "../msg/SetBindingsMsg.js";
import { StateConfig, StateMenuConfig } from "../settings/stateMenuForm.js";
import { sendMessage } from "../websocket.js";
import { ConfigState } from "./ConfigState.js";
import { IState } from "./IState.js";
import { SimpleState } from "./SimpleState.js";

class StateMachine {
    private state: string
    private states: Record<string, IState>
    private stateStack: string[]
    private configState = new ConfigState();

    constructor() {
        this.refreshStates();
        this.stateChange(this.state);
        this.stateStack = [];
    }

    refreshStates() {
        const settings = game.settings.get(ModuleID, 'stateConfigs') as StateMenuConfig;

        var stateList = settings.states.map(sc => {
            return new SimpleState(sc.name);
        })

        this.state = stateList[0].name;
        this.states = {};

        stateList.forEach(s => {
            this.states[s.name] = s;
        });

        this.states["_config"] = this.configState;
    }

    async handleMessage(msg: IMsg): Promise<any> {
        if (msg.type === PingMsg.id || msg.type === PongMsg.id) {
            return;
        }

        debug(`State '${this.states[this.state].name}' received message`, msg);

        return await this.states[this.state].handleMessage(msg);
    }

    getCurrentState(): IState {
        return this.states[this.state];
    }

    reactivate(): Promise<any> {
        return this.stateChange(this.state);
    }

    getAllStates(): Array<IState> {
        return Object.values(this.states);
    }

    pushState(name: string) {
        debug(`pushing state ${name}`);
        this.stateStack.push(this.state);
        this.state = name;
        this.stateChange(name);
    }

    popState() {
        if (this.stateStack.length > 0) {
            debug(`popping back to state ${this.stateStack[this.stateStack.length - 1]}`);
            this.stateChange(this.stateStack.pop());
        }
    }

    peekState(): IState {
        if (this.stateStack.length > 0) {
            return this.states[this.stateStack[this.stateStack.length - 1]];
        }

        return this.getCurrentState();
    }

    changeState(name: string) {
        if (this.stateStack.length > 0) {
            this.stateStack.pop();
        }

        this.pushState(name);
    }

    swapPreviousState(replaceState: string) {
        this.stateStack[this.stateStack.length - 1] = replaceState;
    }

    private async stateChange(newStateName: string): Promise<any> {
        const oldState = this.states[this.state];
        const newState = this.states[newStateName];

        if (oldState) {
            await oldState.deactivate();
        }

        if (!newState) {
            debug(`Unable to find state '${newStateName}'`);
            return;
        }

        await newState.activate();

        this.state = newStateName;

        const settings = game.settings.get(ModuleID, "stateConfigs") as StateMenuConfig;
        const currentStateSettings = settings.states.find(s => s.name === newState.name);
        settings.currentState = settings.states.indexOf(currentStateSettings);
        game.settings.set(ModuleID, "stateConfigs", settings);
        this.postStateUpdate(currentStateSettings);
    }

    postStateUpdate(currentStateSettings: StateConfig) {
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