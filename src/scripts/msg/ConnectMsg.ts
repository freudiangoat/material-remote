/**
 * A message indicating a connection has occurred.
 */
export class ConnectMsg implements IMsg {
    /**
     * The type string for ConnectMsg objects.
     */
    static id = "connect";

    /**
     * The type of event. Should be "connect".
     */
    type: string;

    /**
     * The name of the party sending the connect message.
     */
    name: string;

    constructor(name: string) {
        this.type = ConnectMsg.id;
        this.name = name;
    }

    toString(): string {
        return "Connect";
    }
}