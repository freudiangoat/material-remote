export class ButtonMsg implements IMsg {
    static id = "button";

    type: string;
    name: string;
    pressed: boolean;

    constructor(name: string, pressed: boolean) {
        this.type = ButtonMsg.id;
        this.name = name;
        this.pressed = pressed;
    }

    toString(): string {
        return `${game.i18n.localize("MaterialRemote.Message.Button")} '${this.name}'`;
    }
}