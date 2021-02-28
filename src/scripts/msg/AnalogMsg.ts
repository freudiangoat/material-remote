export class AnalogMsg implements IMsg {
    static id = "analog";

    type: string;
    name: string;
    value: number;

    constructor(name: string, value: number) {
        this.type = AnalogMsg.id;
        this.name = name;
        this.value = value;
    }

    toString(): string {
        return `Analog ${this.name}`
    }
}