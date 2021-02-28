export interface IState {
    /**
     * The name of the state.
     */
    name: string;

    activate(): Promise<void>;

    handleMessage(msg: IMsg): Promise<any>;
}