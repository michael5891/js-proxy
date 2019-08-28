import {BaseProxyHandler, proxyFn} from "./base";
import {bindFn} from "../generics";

/**
 * None es6 promise polyfill as bluebird will have a simple 'then' function.
 */
export function isPromisePolyfill(obj) {
    return obj && typeof obj.then === 'function';
}

/**
 * Native es6
 */
export function isPromiseNative(obj) {
    return obj instanceof Promise;
}

export function isPromise(obj) {
    return isPromiseNative(obj) || isPromisePolyfill(obj);
}

export class PromiseProxyHandler extends BaseProxyHandler {
    constructor() {
        super();
    }

    get(target, prop) {
        let scope = target;
        const value = target[prop];

        if (prop === 'then') {
            scope = target.then(response => this.proxify(response));
        }

        return typeof value === 'function' ? bindFn(scope, prop) : value;
    }

    proxify(target: any = proxyFn(), name = null) {
        const subject = super.proxify(target, name);

        if(this.filter(subject)) {
            return subject;
        }

        if (isPromise(subject)) {
            return new Proxy(subject, new PromiseProxyHandler());
        }

        return subject;
    }
}
