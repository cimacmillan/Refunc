import { FunctionEventSubscriber } from "./FunctionSubscriber";
import { ActionType, Callback, ReducerActions, ReducerActionType, ReducerDefinition } from "./Types";

function mapEmptyActionsToCallback(
    actions: ActionType,
    callback: Callback
) {
    const newActions: Partial<ActionType> = {};
    Object.keys(actions).forEach((key) => {
        newActions[key] = callback;
    });
    return newActions as ActionType;
}

function mapReducerActionsToActionType<State>(
    actions: ReducerActionType<State, ActionType>,
    getState: () => State,
    setState: (state: State) => void
): ActionType {
    const newActions: Partial<ActionType> = {};
    Object.keys(actions).forEach((key) => {
        newActions[key] = (...args: any) => {
            const state = getState();
            setState(actions[key]!(state, ...args));
        };
    });
    return newActions as ActionType;
}


export class Store<State, Actions extends ActionType> {
    private eventListeners: FunctionEventSubscriber<Actions>;
    private changeListeners: Callback[] = [];
    private state: State;

    public constructor(
        reducer: ReducerDefinition<State, Actions>,
        emptyActions: Actions
    ) {
        this.state = reducer.state;
        this.eventListeners = new FunctionEventSubscriber<Actions>(
            emptyActions
        );
        this.eventListeners.subscribe(
            mapReducerActionsToActionType(
                reducer.actions,
                () => this.state,
                (state: State) => this.state = state
                ) as Actions
        );
        this.eventListeners.subscribe(
            mapEmptyActionsToCallback(emptyActions, () => {
                this.changeListeners.forEach((listener) => listener());
            }) as Actions
        );
    }

    public getState(): State {
        return this.state;
    }

    public getActions(): Actions {
        return this.eventListeners.actions();
    }

    public subscribe(actions: Partial<Actions>) {
        this.eventListeners.subscribe(actions);
    }

    public unsubscribe(actions: Partial<Actions>) {
        this.eventListeners.unsubscribe(actions);
    }

    public addChangeListener(callback: Callback) {
        this.changeListeners.push(callback);
    }

    public removeChangeListener(callback: Callback) {
        const index = this.changeListeners.indexOf(callback);
        if (index < 0) {
            return;
        }
        this.changeListeners.splice(index, 1);
    }
}
