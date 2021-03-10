import { ModuleID } from "./constants.js";
import { registerSettings } from "./settings/settings.js";
import { initializeStateMachine } from "./states/StateMachine.js";
import { startWebsocket } from "./websocket.js";

Hooks.once('init', ()=> {
    registerSettings();
});

Hooks.once('ready', () => {
    initializeStateMachine();

    if (!game.settings.get(ModuleID, 'enable')) {
        return;
    }

    startWebsocket();
})