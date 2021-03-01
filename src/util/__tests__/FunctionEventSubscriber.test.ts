import { FunctionEventSubscriber } from "../FunctionEventSubscriber";

describe("FunctionEventSubscriber", () => {
    test("can be called with no subscribers", () => {
        const events = new FunctionEventSubscriber<{
            a: () => void;
            b: () => void;
        }>({
            a: () => undefined,
            b: () => undefined,
        });

        events.actions().a();
        events.actions().b();
    });

    test("can be called with one subscriber", () => {
        const subscriber = {
            a: jest.fn(),
            b: jest.fn(),
        };
        const events = new FunctionEventSubscriber<{
            a: () => void;
            b: () => void;
        }>({
            a: () => undefined,
            b: () => undefined,
        });
        events.subscribe(subscriber);
        events.actions().a();
        events.actions().b();

        expect(subscriber.a).toHaveBeenCalledTimes(1);
        expect(subscriber.b).toHaveBeenCalledTimes(1);
    });

    test("can be called with two subscribers", () => {
        const subscriber = {
            a: jest.fn(),
            b: jest.fn(),
        };
        const anotherSubscriber = {
            a: jest.fn(),
            b: jest.fn(),
        };
        const events = new FunctionEventSubscriber<{
            a: () => void;
            b: () => void;
        }>({
            a: () => undefined,
            b: () => undefined,
        });
        events.subscribe(subscriber);
        events.subscribe(anotherSubscriber);
        events.actions().a();
        events.actions().b();

        expect(subscriber.a).toHaveBeenCalledTimes(1);
        expect(subscriber.b).toHaveBeenCalledTimes(1);
        expect(anotherSubscriber.a).toHaveBeenCalledTimes(1);
        expect(anotherSubscriber.b).toHaveBeenCalledTimes(1);
    });

    test("can be called with one subscriber unsubbed", () => {
        const subscriber = {
            a: jest.fn(),
            b: jest.fn(),
        };
        const anotherSubscriber = {
            a: jest.fn(),
            b: jest.fn(),
        };
        const events = new FunctionEventSubscriber<{
            a: () => void;
            b: () => void;
        }>({
            a: () => undefined,
            b: () => undefined,
        });
        events.subscribe(subscriber);
        events.subscribe(anotherSubscriber);
        events.unsubscribe(subscriber);
        events.actions().a();
        events.actions().b();

        expect(subscriber.a).toHaveBeenCalledTimes(0);
        expect(subscriber.b).toHaveBeenCalledTimes(0);
        expect(anotherSubscriber.a).toHaveBeenCalledTimes(1);
        expect(anotherSubscriber.b).toHaveBeenCalledTimes(1);
    });

    test("can be called with part complete subscribers", () => {
        const subscriber = {
            a: jest.fn(),
        };
        const anotherSubscriber = {
            b: jest.fn(),
        };
        const events = new FunctionEventSubscriber<{
            a: () => void;
            b: () => void;
        }>({
            a: () => undefined,
            b: () => undefined,
        });
        events.subscribe(subscriber);
        events.subscribe(anotherSubscriber);
        events.actions().a();
        events.actions().b();

        expect(subscriber.a).toHaveBeenCalledTimes(1);
        expect(anotherSubscriber.b).toHaveBeenCalledTimes(1);
    });

    test("can be called with data", () => {
        const subscriber = {
            a: jest.fn(),
        };
        const anotherSubscriber = {
            b: jest.fn(),
        };
        const events = new FunctionEventSubscriber<{
            a: (x: number, y: number) => void;
            b: (word: string, values: number[]) => void;
        }>({
            a: () => undefined,
            b: () => undefined,
        });
        events.subscribe(subscriber);
        events.subscribe(anotherSubscriber);
        events.actions().a(1, 2);
        events.actions().b("hello", [1, 2]);

        expect(subscriber.a).toHaveBeenCalledTimes(1);
        expect(subscriber.a).toHaveBeenCalledWith(1, 2);
        expect(anotherSubscriber.b).toHaveBeenCalledTimes(1);
        expect(anotherSubscriber.b).toHaveBeenCalledWith("hello", [1, 2]);
    });
});
