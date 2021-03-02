import { Store } from "../Store";

const emptyActions = {
    increment: () => {},
    addX: (x: number) => {}
}

interface State {
    count: number
}

const reducer = {
    state: {
        count: 0
    },
    actions: {
        increment: (state: State) => ({...state, count: state.count + 1}),
        addX: (state: State, x: number) => ({...state, count: state.count + x}),
    }
}

describe("Store", () => {
    test("state updates when actions called", () => {
        const store = new Store(
            reducer,
            emptyActions
        );

        expect(store.getState()).toEqual({
            count: 0
        })

        store.getActions().increment();

        expect(store.getState()).toEqual({
            count: 1
        });

        store.getActions().addX(10);

        expect(store.getState()).toEqual({
            count: 11
        });
    });

    test("change listeners are called after state updated", () => {
        expect.assertions(1);

        const store = new Store(
            reducer,
            emptyActions
        );

        store.addChangeListener(() => {
            expect(store.getState()).toEqual({
                count: 10
            })
        });
        store.getActions().addX(10);
    });

    test("store subscribers are called after state updated", () => {
        expect.assertions(2);

        const store = new Store(
            reducer,
            emptyActions
        );

        store.subscribe({
            addX: (x: number) => {
                expect(x).toEqual(10);
                expect(store.getState()).toEqual({
                    count: 10
                })
            }
        });
        store.getActions().addX(10);
    });

});

