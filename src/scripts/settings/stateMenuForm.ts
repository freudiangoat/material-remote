import { ModuleID } from "../constants.js";
import { HandlerDispatcher } from "../handlers/HandlerManager.js";
import { ConfigState } from "../states/ConfigState.js";
import { StateManager } from "../states/StateMachine.js";

export interface MappingConfig {
    event: string;
    type: string;
    msg: string;
    value: string;
}

export interface StateConfig {
    name: string
    mappings: MappingConfig[]
}

export interface StateMenuConfig {
    currentState: number;
    states: StateConfig[];
}

export interface MappingTypeConfig {
    name: string
    id: string
}

export interface StateConfigData extends Record<string, any> {
    states: StateConfig[]
    currentState: StateConfig
    types: Array<MappingTypeConfig>
}

export class stateMenuForm extends FormApplication<StateMenuConfig> {
    private data: StateMenuConfig;

    constructor(data: StateMenuConfig, options: FormApplication.Options) {
        super(data, options)

        this.data = data;
        StateManager.pushState("_config");
    }

    static get defaultOptions() {
        return mergeObject(
            super.defaultOptions,
            {
                id: "stateConfig",
                title: game.i18n.localize("MaterialRemote.Menu.StateConfig.Title"),
                template: "./modules/material-remote/templates/stateConfigMenu.html",
                classes: ["sheet"],
                submitOnClose: true,
                width: 500,
                height: "auto",
                resizable: true
            });
    }

    async close(options?: object): Promise<void> {
        await game.settings.set(ModuleID, "stateConfigs", this.data);
        StateManager.popState();
        await super.close(options);
    }

    addMapping(): void {
        const state = this.data.states[this.data.currentState];
        const defaultType = Object.keys(HandlerDispatcher.handlerTypes)[0];
        state.mappings.push({
            event: "",
            msg: "",
            type: defaultType,
            value: HandlerDispatcher.getDefault(defaultType),
        });
    }

    removeMapping(idx: number): void {
        const state = this.data.states[this.data.currentState];
        state.mappings.splice(idx, 1);
    }

    getData(): StateConfigData {
        const settings = game.settings.get(ModuleID, "stateConfigs") as StateMenuConfig;

        this.data = settings;

        let output = {
            states: this.data.states,
            currentState: this.data.states[0],
            types: [],
        };

        return HandlerDispatcher.augmentSettings(output);
    }

    activateListeners(html: JQuery | HTMLElement) {
        if (!(this.form instanceof HTMLElement))
        {
            return;
        }

        this.form.querySelectorAll("a")
            .forEach(v => v.addEventListener("click", e => this._onAClick(e)));

        this.form.querySelectorAll("button")
            .forEach(v => v.addEventListener("click", e => this._onEventListen(e)))

        this.form.querySelectorAll("select")
            .forEach(v => v.addEventListener("change", e => this.onMacroChange(e)))
        return;
    }

    async onMacroChange(e: Event): Promise<any> {
        const state = StateManager.getCurrentState();
        if (!(state instanceof ConfigState))
        {
            return;
        }

        if (!(e.currentTarget instanceof HTMLSelectElement))
        {
            return;
        }

        const target = e.currentTarget;
        const idx = parseInt(target.parentElement.dataset.index);
        const currentState = this.data.states[this.data.currentState];
        const mapping = currentState.mappings[idx];

        if (target.id === "type") {
            mapping.type = target.value;

            await this.submit({preventClose: true});
            this.render();
            return;
        }

        if (target.id === "value") {
            mapping.value = target.value;

            await this.submit({preventClose: true});
            this.render();
            return;
        }
    }

    async _updateObject(event: Event | JQuery.Event, formData: object): Promise<any> {
        await game.settings.set(ModuleID, "stateConfigs", this.data);
        return this.data;
    }

    private _onEventListen(e: MouseEvent): any {
        e.preventDefault();

        const state = StateManager.getCurrentState();
        if (!(state instanceof ConfigState))
        {
            return;
        }

        if (e.currentTarget instanceof HTMLElement)
        {
            const target = e.currentTarget;
            const idx = parseInt(target.parentElement.dataset.index);
            const currentState = this.data.states[this.data.currentState];
            const mapping = currentState.mappings[idx];
            target.innerText = game.i18n.localize("MaterialRemote.Setting.Listening");
            state.setListener(m => {
                target.innerText = m.toString();
                mapping.event = m.toString();
                mapping.msg = JSON.stringify(m);
                state.setListener(null);
            });
        }
    }

    private _onAClick(event: MouseEvent | JQuery.ClickEvent): Promise<any> {
        event.preventDefault();

        if (!(event.currentTarget instanceof HTMLElement))
        {
            return;
        }

        const btn = event.currentTarget;
        switch (btn.dataset.action) {
            case "add":
                this.addMapping();
                return this.submit({preventClose: true})
                    .then(() => this.render());
            case "del":
                const idx = btn.parentElement.parentElement.dataset.index;
                this.removeMapping(parseInt(idx));
                return this.submit({preventClose: true})
                    .then(() => this.render());
        }
    }
}