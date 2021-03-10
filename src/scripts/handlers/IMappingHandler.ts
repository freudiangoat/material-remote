import { StateConfigData } from "../settings/stateMenuForm.js";

export interface IMappingHandler {
    type: string

    handle(value: string): void;

    augmentSettings(original: StateConfigData): StateConfigData;

    getDefault(): string;
}