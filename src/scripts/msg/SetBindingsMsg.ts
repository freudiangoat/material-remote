export class SetBindingsMsg implements IMsg {
    static id = "set_bindings";

    type: string;
    boundButtons: string[];

    constructor(boundButtons: string[]) {
        this.type = SetBindingsMsg.id;
        this.boundButtons = boundButtons;
    }

    toString(): string {
        return `Bound Buttons: ${this.boundButtons.join(", ")}`
    }
}