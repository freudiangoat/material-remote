export class PingMsg implements IMsg {
    static id = "ping"; 

    type: string;

    constructor() {
        this.type = PingMsg.id;
    }

    toString(): string {
        return "Ping";
    }
}

export class PongMsg implements IMsg {
    static id = "pong"; 

    type: string;

    constructor() {
        this.type = PongMsg.id;
    }

    toString(): string {
        return "Pong";
    }
}