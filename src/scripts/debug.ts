import { ModuleID, Tag } from "./constants.js";

export function debug(...args: any[]): void {
    if (!game.settings.get(ModuleID, 'debug')) {
        return;
    }

    console.log(`${Tag}`, ...args);
}