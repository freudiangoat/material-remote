import { MappingConfig, StateConfigData } from "../settings/stateMenuForm.js";
import { IMappingHandler } from "./IMappingHandler.js";

export class MacroHandler implements IMappingHandler {
    static id: string = "macro";

    type: string;

    constructor() {
        this.type = MacroHandler.id;
    }

    getDefault(): string {
        return game.macros[0]?._id ?? "";
    }

    augmentSettings(original: StateConfigData): StateConfigData {
        return {
            ...original,
            types: [
                ...original.types,
                {
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.Macro"),
                    id: MacroHandler.id 
                }
            ],
            [MacroHandler.id]: [
                {
                    name: game.i18n.localize("MaterialRemote.Setting.SelectMacro"),
                    _id: null
                },
                ...game.macros
            ]
        };
    }

    handle(value: string): void {
        const macro = game.macros.get(value);
        macro?.execute();
    }
}