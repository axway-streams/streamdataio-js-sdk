export declare class Listeners<T> {
    private _listeners;
    /**
     * Return the registered listeners
     *
     * @memberOf Listeners#
     */
    readonly listeners: Listener<T>[];
    /**
     * @param data
     * @memberOf Listeners#
     */
    fire(data?: T): void;
    /**
     * @memberOf Listeners#
     * @param callback
     * @param thisArg
     */
    addCallback(callback: (data: T) => void, thisArg?: any): Listener<T>;
    /**
     * @memberOf Listeners#
     * @param listener
     */
    add(listener: Listener<T>): Listener<T>;
    /**
     * @memberOf Listeners#
     * @param listener
     */
    remove(listener: Listener<T>): void;
}
export interface Listener<T> {
    callback: (data: T) => void;
    thisArg?: any;
}
