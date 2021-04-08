import { AnalogMsg } from "../msg/AnalogMsg.js";
import { StateConfigData } from "../settings/stateMenuForm.js";
import { IMappingHandler } from "./IMappingHandler.js";

export class SceneLightingHandler implements IMappingHandler {
    static id = "scene_lightning";
    type: string;

    constructor() {
        this.type = SceneLightingHandler.id;
    }

    supportsMessage(msg: IMsg): msg is AnalogMsg {
        return msg instanceof AnalogMsg;
    }

    handle(msg: IMsg, value: string): void {
        if (!this.supportsMessage(msg)) {
            return;
        }

        canvas.scene.update({darkness: msg.percentage / 100});
    }

    augmentSettings(original: StateConfigData): StateConfigData {
        return {
            ...original,
            types: [
                ...original.types,
                {
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.SceneLighting"),
                    id: this.type,
                    supportsMessage: this.supportsMessage
                }
            ],
            [this.type]: [
                {
                    _id: "darkness",
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.SceneLightingDarkness")
                }
            ]
        }
    }

    getDefault(): string {
        return "darkness";
    }

}