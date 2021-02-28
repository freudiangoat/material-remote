import { ModuleID } from "../constants.js"
import { stateMenuForm } from "./stateMenuForm.js";

export const registerSettings = function() {
    game.settings.register(
        ModuleID,
        "enable",
        {
            name: "MaterialRemote.Setting.Enable.Name",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
            onChange: () => window.location.reload()
        }
    );

    game.settings.register(
        ModuleID,
        "address",
        {
            name: "MaterialRemote.Setting.Address.Name",
            hint: "MaterialRemote.Setting.Address.Hint",
            scope: "client",
            config: true,
            default: "localhost:7071",
            type: String,
            onChange: () => window.location.reload()
        }
    );

    game.settings.register(
        ModuleID,
        "debug",
        {
            name: "MaterialRemote.Setting.Debug.Name",
            hint: "MaterialRemote.Setting.Debug.Hint",
            scope: "client",
            config: true,
            default: false,
            type: Boolean,
        }
    );

    game.settings.registerMenu(
        ModuleID,
        "stateMenu",
        {
            name: "MaterialRemote.Setting.StateMenu.Name",
            label: "MaterialRemote.Setting.StateMenu.Label",
            type: stateMenuForm,
            restricted: false
        }
    );

    game.settings.register(
        ModuleID,
        "stateConfigs",
        {
            name: "stateConfigs",
            scope: "config",
            type: Object,
            default: {
                currentState: 0,
                states: [
                    {
                        name: "Default State",
                        mappings: []
                    }
                ] 
            },
            config: false
        }
    );
}