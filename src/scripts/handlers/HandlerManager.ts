import { debug } from "../debug.js";
import { MappingConfig, StateConfigData } from "../settings/stateMenuForm.js";
import { CombatHandler } from "./CombatHandler.js";
import { IMappingHandler } from "./IMappingHandler.js";
import { MacroHandler } from "./MacroHandler.js";
import { PlaylistChangeHandler } from "./PlaylistChangeHandler.js";
import { SceneLightingHandler } from "./SceneLightingHandler.js";
import { StateChangeHandler } from "./StateChangeHandler.js";


class HandlerManager {
    handlerTypes: Record<string, IMappingHandler> = {};

    registerHandler(t: any) {
        this.handlerTypes[t.id] = new t();
    }

    getHandlerTypes(msg: IMsg | null): Array<string> {
        if (msg === null) {
            return Object.keys(this.handlerTypes)
        }

        return Object.keys(this.handlerTypes).filter(type => this.handlerTypes[type].supportsMessage(msg));
    }

    getDefault(id: string): string {
        return this.handlerTypes[id]?.getDefault() ?? "";
    }

    augmentSettings(output: StateConfigData): any {
        var newObj = {
            ...output
        };

        Object.keys(this.handlerTypes).forEach(id => {
            const handler = this.handlerTypes[id];

            newObj = handler.augmentSettings(newObj);
        });

        return newObj;
    }

    handle(msg: IMsg, mapping: MappingConfig) {
        if (!mapping) {
            debug("Received unmapped message.");
            return;
        }

        const handler = this.handlerTypes[mapping.type];
        if (!handler || !handler.supportsMessage(msg)) {
            return;
        }

        handler.handle(msg, mapping.value);
    }
}

export const HandlerDispatcher = new HandlerManager();

HandlerDispatcher.registerHandler(MacroHandler);
HandlerDispatcher.registerHandler(CombatHandler);
HandlerDispatcher.registerHandler(SceneLightingHandler);
HandlerDispatcher.registerHandler(StateChangeHandler);
HandlerDispatcher.registerHandler(PlaylistChangeHandler);