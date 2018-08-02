import {Logger} from './logger';
import {Preconditions} from './preconditions';

export class Listeners<T> {

  private _listeners: Listener<T>[] = [];

  /**
   * Return the registered listeners
   *
   * @memberOf Listeners#
   */
  public get listeners(): Listener<T>[] {
    return this._listeners;
  }

  /**
   * @param data
   * @memberOf Listeners#
   */
  public fire(data?: T) {
    const listeners = this._listeners.slice(); // copy to prevent concurrent modifications
    listeners.forEach(listener => {
      const callback = listener.callback;
      const thisArg = listener.thisArg;
      try {
        if (thisArg) {
          callback.apply(thisArg, [data]);
        } else {
          callback(data);
        }
      }
      catch (error) {
        Logger.error('Unable to fire event: {0}', error);
      }
    });
  }

  /**
   * @memberOf Listeners#
   * @param callback
   * @param thisArg
   */
  public addCallback(callback: (data: T) => void, thisArg?: any): Listener<T> {
    let listener = {
      callback,
      thisArg
    } as Listener<T>;
    return this.add(listener);
  }

  /**
   * @memberOf Listeners#
   * @param listener
   */
  public add(listener: Listener<T>): Listener<T> {
    Preconditions.checkNotNull(listener, 'listener cannot be null');
    Preconditions.checkNotNull(listener.callback, 'callback cannot be null');
    Preconditions.checkExpression(this._listeners.indexOf(listener) === -1, 'listener already exists');
    this._listeners.push(listener);
    return listener;
  }

  /**
   * @memberOf Listeners#
   * @param listener
   */
  public remove(listener: Listener<T>) {
    Preconditions.checkNotNull(listener, 'listener cannot be null');
    let indexOf = this._listeners.indexOf(listener);
    Preconditions.checkExpression(indexOf >= 0, 'listener doesn\'t exist');
    this._listeners.splice(indexOf, 1);
  }
}

export interface Listener<T> {
  callback: (data: T) => void;
  thisArg?: any;
}


