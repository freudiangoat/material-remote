import { ModuleID } from "./constants.js";
import { parseMessage } from "./msg/MessageFactory.js";
import { registerSettings } from "./settings/settings.js";
import { MappingTypeConfig } from "./settings/stateMenuForm.js";
import { initializeStateMachine } from "./states/StateMachine.js";
import { startWebsocket } from "./websocket.js";

Hooks.once('init', ()=> {
    registerSettings();
});

Hooks.once('ready', () => {
    initializeStateMachine();

    Handlebars.registerHelper(
        "mrFilterMessageHandlers",
        (collection: Array<MappingTypeConfig>, msgStr: string): Array<MappingTypeConfig> => {
            const msg = parseMessage(msgStr);

            return collection.filter(m => !msg || m.supportsMessage(msg));
        });

    Handlebars.registerHelper(
        "mrDefault",
        (a: any, b: any): any => {
            if (Array.isArray(b) && b.length === 0) {
                return Array.isArray(a) ? a : [a];
            }

            return b || a
        });

    Handlebars.registerHelper(
        "mrDict",
        (...val: Array<any>): any => {
            let obj = {};
            for(let i = 0; i < val.length; i += 2) {
                obj = {
                    ...obj,
                    [val[i]]: val[i+1] ?? null
                };
            }

            return obj;
        });
    

    if (!game.settings.get(ModuleID, 'enable')) {
        return;
    }

    startWebsocket();
})