export type Callback = (...args: any[]) => any;

export type StateCallback<State> = (state: State, ...args: any[]) => State;

export type ActionType = {
    [key: string]: Callback;
}

export type ReducerActions<State, Actions extends ActionType> = {
    [key in keyof Actions]: StateCallback<State>
}

export type ReducerActionType<State, Actions extends ActionType> = Partial<ReducerActions<State, Actions>>;

export interface Reducer<State, Actions extends ActionType> {
    state: State;
    actions: Partial<ReducerActions<State, Actions>>;
}
