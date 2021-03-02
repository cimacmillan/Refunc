

export function combineReducers<State, Actions extends ActionType>(
    reducers: Record<string, Reducer<any, Actions>>,
    emptyActions: Actions
): Reducer<any, Actions> {
    const eventListeners = new FunctionEventSubscriber<Actions>(emptyActions);

    Object.keys(reducers).forEach((key) => {
        const reducer = reducers[key];
        eventListeners.subscribe(reducer.actions);
    });

    const getState = () => {
        let state = {};
        Object.keys(reducers).forEach((key) => {
            const reducer = reducers[key];
            Object.assign(state, {
                [key]: reducer.getState(),
            });
        });
        return state;
    };

    return {
        getState,
        actions: eventListeners.actions(),
    };
}


