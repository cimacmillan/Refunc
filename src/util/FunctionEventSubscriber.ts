type Callback = (...args: any) => void;

export class FunctionEventSubscriber<T extends {}> {
    private listeners: Array<Partial<T>> = [];
    private compiledActions: T | undefined;

    public constructor(private emptyActions: T) {}

    public actions(): T {
        return this.compiledActions || this.emptyActions;
    }

    public subscribe(actions: Partial<T>) {
        this.listeners.push(actions);
        this.compileEvents();
    }

    public unsubscribe(actions: Partial<T>) {
        const index = this.listeners.indexOf(actions);
        if (index < 0) {
            return;
        }
        this.listeners.splice(index, 1);
        this.compileEvents();
    }

    private compileEvents() {
        const constructedEvents: Partial<Record<keyof T, Callback[]>> = {};
        this.listeners.forEach((listener) => {
            const actions = Object.keys(listener) as Array<keyof T>;
            actions.forEach((action) => {
                const callback = (listener[action] as any) as Callback;
                if (constructedEvents[action]) {
                    (constructedEvents[action] as any).push(callback);
                } else {
                    constructedEvents[action] = [callback];
                }
            });
        });
        const compiledActions: Partial<Record<keyof T, Callback>> = {};
        Object.keys(constructedEvents).forEach((key) => {
            compiledActions[key as keyof T] = (...args: any) => {
                (constructedEvents[key as keyof T] as any).forEach((callback: Callback) =>
                    callback(...args)
                );
            };
        });
        this.compiledActions = { ...this.emptyActions, ...compiledActions };
    }
}
