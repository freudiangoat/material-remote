import { StateConfigData } from "../settings/stateMenuForm.js";

export interface IMappingHandler {
    type: string

    supportsMessage(msg: IMsg): boolean;

    handle(msg: IMsg, value: string): void;

    augmentSettings(original: StateConfigData): StateConfigData;

    getDefault(): string;
}