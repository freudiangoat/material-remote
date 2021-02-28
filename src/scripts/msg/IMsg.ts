/**
 * The base interface for messages sent between the module and the hardware server.
 */
interface IMsg {
    /**
     * The type of message being sent.
     */
    type: string

    /**
     * Converts the message to a user facing string.
     */
    toString(): string;
}