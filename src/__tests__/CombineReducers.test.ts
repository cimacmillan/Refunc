
import { combineReducers } from "../CombineReducers";
import { Store } from "../Store";
import { Reducer } from "../Types";

const emptyActions = {
    increment: () => {},
    addX: (x: number) => {}
}

type Actions = typeof emptyActions;
type CountState = number;
type CallRecordState = number;

interface State {
    count: CountState,
    numberOfCalls: CallRecordState
}

const countReducer: Reducer<CountState, Actions> = {
    state: 0,
    actions: {
        increment: (state: CountState) => (state + 1),
        addX: (state: CountState, x: number) => (state + x),
    }
}

const numberOfCallsReducer: Reducer<CallRecordState, Actions> = {
    state: 0,
    actions: {
        increment: (state: CountState) => (state + 1),
        addX: (state: CountState, x: number) => (state + 1),
    }
}

const reducer = combineReducers({
    count: countReducer,
    numberOfCalls: numberOfCallsReducer
})

describe("CombineReducers", () => {
    test("combines reducers", () => {
        const store = new Store(
            reducer,
            emptyActions
        );

        expect(store.getState()).toEqual({
            count: 0,
            numberOfCalls: 0
        })

        store.getActions().increment();

        expect(store.getState()).toEqual({
            count: 1,
            numberOfCalls: 1
        });

        store.getActions().addX(10);

        expect(store.getState()).toEqual({
            count: 11,
            numberOfCalls: 2
        });
    });
});




