import { ActionType, Reducer, ReducerActions, StateCallback } from "./Types";

interface IndexedState {
    [key: string]: any;
}

type IndexedReducers<State extends IndexedState, Actions extends ActionType> = {
    [key in keyof State]: Reducer<State[key], Actions>
}

type ActionLists<State extends IndexedState, Actions extends ActionType> = {
    [key in keyof Actions]: [keyof State, StateCallback<any>][]
}

export function combineReducers<State extends IndexedState, Actions extends ActionType>(
    reducers: IndexedReducers<State, Actions>
): Reducer<State, Actions> {
    const state: Partial<State> = {};
    const actions: Partial<ReducerActions<State, Actions>> = {};
    const actionLists: Partial<ActionLists<State, Actions>> = {};

    Object.keys(reducers).forEach((key: keyof State) => {
        const reducer = reducers[key];
        state[key] = reducer.state;    

        Object.keys(reducer.actions).forEach((actionKey: keyof Actions) => {
            const reducerActions: StateCallback<any> = reducer.actions[actionKey]!;
            const actionListElement: [keyof State, StateCallback<any>] = [key, reducerActions];
            if (actionLists[actionKey]) {
                actionLists[actionKey]!.push(actionListElement);
            } else {
                actionLists[actionKey] = [ actionListElement ];
            }
        });
    });

    Object.keys(actionLists).forEach((actionKey: keyof Actions) => {
        const actionList = actionLists[actionKey]!;
        const stateCallback: StateCallback<State> = (state: State, ...args: any[]) => {
            const newState = {...state};
            actionList.forEach(([key, callback]) => {
                const subState = callback(state[key], ...args);
                newState[key] = subState;
            });
            return newState;
        } 
        actions[actionKey] = stateCallback;
    })

    return {
        state: state as State, 
        actions
    };
}
