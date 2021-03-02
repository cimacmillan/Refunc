# Refunc
Redux-like state container with actions as functions

## Quick start

## Installing

```
npm install @cimacmillan/refunc
```

## Usage

Refunc takes actions as functions, with payload as parameters
```
const emptyActions = {
    increment: () => {},
    addX: (x: number) => {}
}
```

Reducers are defined as their initial state and functions for transforming state based on actions
```
const reducer = {
    state: {
        count: 0
    },
    actions: {
        increment: (state: State) => ({...state, count: state.count + 1}),
        addX: (state: State, x: number) => ({...state, count: state.count + x}),
    }
}
```

The store is created by passing a reducer definition, and the empty actions

```
const store = new Store(
    reducer,
    emptyActions
);
```

The store is updated by calling actions

```
store.getActions().increment();
store.getActions().addX(10);
// store.getState() = { count: 11 }
```

The store can notify listeners of changes to the state

```
store.addChangeListener(() => {
    console.log(`new state is ${store.getState()}`)
});
```

The stores actions can be subscribed to

```
store.subscribe({
    increment: () => {
        console.log("increment was called");
    },
    addX: (x: number) => {
        console.log(`addX was called with ${x}`);
    }
})
```

Multiple reducers can be combined with combineReducers 

```
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

const store = new Store(
    combineReducers({
        count: countReducer,
        numberOfCalls: numberOfCallsReducer
    }),
    emptyActions
);

// store.getState() = { count: 0, numberOfCalls: 0 }

store.getActions().increment();

// store.getState() = { count: 1, numberOfCalls: 1 }

store.getActions().addX(10);

// store.getState() = { count: 11, numberOfCalls: 2 }

```

This can be used with React hooks with these effects

```
export const useGlobalState: () => [State, Actions] = () => {
    const [storeState, setStore] = React.useState(store.getState());
    React.useEffect(() => {
        const callback = () => setStore(store.getState());
        store.addChangeListener(callback);
        return () => store.removeChangeListener(callback);
    }, []);
    return [storeState, store.getActions()];
};

export const useDispatchListener = (actions: Partial<Actions>, deps: any[]) => {
    React.useEffect(() => {
        store.subscribe(actions);
        return () => store.unsubscribe(actions);
    }, deps);
}

```