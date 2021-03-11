import { ButtonMsg } from "../msg/ButtonMsg.js";
import { StateConfigData } from "../settings/stateMenuForm.js";
import { IMappingHandler } from "./IMappingHandler.js";

export class CombatHandler implements IMappingHandler {
    static id: string = "combat";

    type: string;

    constructor() {
        this.type = CombatHandler.id;
    }

    supportsMessage(msgType: IMsg): boolean {
        return msgType instanceof ButtonMsg;
    }

    async handle(msg: IMsg, value: string): Promise<any> {
        if (value === "toggle") {
            if (game.combat) {
                value = "finish";
            } else {
                value = "start";
            }
        }

        if (value === "start") {
            if (game.combat) {
                return;
            }

            const combat = await this.getCombat()
            await combat.startCombat();
        } else {
            if (!game.combat) {
                return;
            }

            await game.combat.endCombat();
        }
    }

    async getCombat(): Promise<any> {
        if (!game.combat) {
            return await Combat.create(
                {
                    combatants: [],
                    scene: canvas.scene
                }
            );
        }

        return game.combat;
    }

    augmentSettings(original: StateConfigData): StateConfigData {
        return {
            ...original,
            types: [
                ...original.types,
                {
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.Combat"),
                    id: this.type,
                    supportsMessage: this.supportsMessage
                }
            ],
            [this.type]: [
                {
                    _id: "start",
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.CombatStart")
                },
                {
                    _id: "toggle",
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.CombatToggle")
                },
                {
                    _id: "finish",
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.CombatFinish")
                },
            ]
        }
    }

    getDefault(): string {
        return "start";
    }
} 