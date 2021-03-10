import { debug } from "../debug.js";
import { MappingConfig, StateConfigData } from "../settings/stateMenuForm.js";
import { CombatHandler } from "./CombatHandler.js";
import { IMappingHandler } from "./IMappingHandler.js";
import { MacroHandler } from "./MacroHandler.js";


class HandlerManager {
    handlerTypes: Record<string, IMappingHandler> = {};

    registerHandler(t: any) {
        this.handlerTypes[t.id] = new t();
    }

    getHandlerTypes(): Array<string> {
        return Object.keys(this.handlerTypes)
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

    handle(mapping: MappingConfig) {
        if (!mapping) {
            debug("Received unmapped message.");
            return;
        }

        this.handlerTypes[mapping.type]?.handle(mapping.value);
    }
}

export const HandlerDispatcher = new HandlerManager();

HandlerDispatcher.registerHandler(MacroHandler);
HandlerDispatcher.registerHandler(CombatHandler);