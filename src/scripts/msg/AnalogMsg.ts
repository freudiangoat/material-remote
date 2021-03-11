export class AnalogMsg implements IMsg {
    static id = "analog";

    type: string;
    name: string;
    position: number;
    percentage: number;

    constructor(name: string, position: number, percentage: number) {
        this.type = AnalogMsg.id;
        this.name = name;
        this.position = position;
        this.percentage = percentage;
    }

    toString(): string {
        return `Analog '${this.name}'`
    }
}