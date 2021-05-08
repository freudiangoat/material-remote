import { ButtonMsg } from "../msg/ButtonMsg.js";
import { StateConfigData } from "../settings/stateMenuForm.js";
import { IMappingHandler } from "./IMappingHandler.js";

export class CombatHandler implements IMappingHandler {
    static id: string = "combat";
    private static _startId: string = "start";
    private static _startAllPlayersId: string = "startAllPlayers";
    private static _toggleId: string = "toggle";
    private static _finishId: string = "finish";
    private static _nextTurnId: string = "next";
    private static _prevTurnId: string = "previous";

    type: string;

    constructor() {
        this.type = CombatHandler.id;
    }

    supportsMessage(msgType: IMsg): boolean {
        return msgType instanceof ButtonMsg;
    }

    async handle(msg: IMsg, value: string): Promise<any> {
        if (value === CombatHandler._toggleId) {
            if (game.combat) {
                value = CombatHandler._finishId;
            } else {
                value = CombatHandler._startId;
            }
        }

        switch (value) {
            case CombatHandler._startId:
            case CombatHandler._startAllPlayersId:
                await this.startCombat(value === CombatHandler._startAllPlayersId);
                break;
            case CombatHandler._finishId:
                await this.finishCombat();
                break;
            case CombatHandler._nextTurnId:
                await this.nextTurn();
                break;
            case CombatHandler._prevTurnId:
                await this.prevTurn();
                break;
        }
    }

    async startCombat(allPlayers: boolean): Promise<any> {
        if (game.combat) {
            return;
        }

        const combat = await this.getCombat()
        await combat.startCombat();

        if (allPlayers) {
            const playerTokens = canvas.tokens.ownedTokens.filter(t => t.actor.hasPlayerOwner);

            playerTokens.forEach((t: Token) => {
                const cbt = combat as any;

                // Looks like this definition is incorrect.
                cbt.createCombatant({
                    tokenId: t.id,
                    hidden: false
                });
            });
        }
    }

    async finishCombat(): Promise<any> {
        if (!game.combat) {
            return;
        }

        await game.combat.endCombat();
    }

    async nextTurn(): Promise<any> {
        if (!game.combat) {
            return;
        }

        await game.combat.nextTurn();
    }

    async prevTurn(): Promise<any> {
        if (!game.combat) {
            return;
        }

        await game.combat.previousTurn();
    }

    async getCombat(): Promise<Combat> {
        if (!game.combat) {
            await Combat.create(
                {
                    combatants: [],
                    scene: canvas.scene
                }
            );

            return game.combat;
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
                    _id: CombatHandler._startId,
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.CombatStart")
                },
                {
                    _id: CombatHandler._startAllPlayersId,
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.CombatStartAllPlayers")
                },
                {
                    _id: CombatHandler._toggleId,
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.CombatToggle")
                },
                {
                    _id: CombatHandler._nextTurnId,
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.CombatNext")
                },
                {
                    _id: CombatHandler._prevTurnId,
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.CombatPrev")
                },
                {
                    _id: CombatHandler._finishId,
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.CombatFinish")
                },
            ]
        }
    }

    getDefault(): string {
        return "start";
    }
} 