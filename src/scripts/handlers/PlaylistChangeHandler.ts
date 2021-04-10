import { ButtonMsg } from "../msg/ButtonMsg.js";
import { StateConfigData } from "../settings/stateMenuForm.js";
import { IMappingHandler } from "./IMappingHandler.js";


export class PlaylistChangeHandler implements IMappingHandler {
    static id: string = "playlist"
    type: string;

    constructor() {
        this.type = PlaylistChangeHandler.id;
    }

    supportsMessage(msg: IMsg): boolean {
        return msg instanceof ButtonMsg;
    }

    handle(msg: IMsg, value: string): void {
        if (value === "_stop") {
            game.playlists.playing.forEach(p => {
                p.stopAll();
            });

            return;
        }

        const playlist = game.playlists.find(p => p.name === value);
        if (!playlist) {
            return;
        }

        playlist.playAll();
    }

    augmentSettings(original: StateConfigData): StateConfigData {
        return {
            ...original,
            types: [
                ...original.types,
                {
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.Playlist"),
                    id: this.type,
                    supportsMessage: this.supportsMessage
                }
            ],
            [this.type]: [
                {
                    _id: "_stop",
                    name: game.i18n.localize("MaterialRemote.Setting.StateConfig.Handler.PlaylistStop")
                },
                ...game.playlists.map(p => {
                    return {
                        _id: p.name,
                        name: p.name
                    }
                })
            ]
        }
    }

    getDefault(): string {
        return "_stop";
    }
}