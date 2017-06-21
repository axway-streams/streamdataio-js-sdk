import {Preconditions} from '../utils/preconditions';
import {Logger} from '../utils/logger';

export class Listeners<T> {

  private _listeners: Listener<T>[] = [];

  /**
   * @memberOf Listeners#
   */
  public fire(data: T) {
    let listeners = this._listeners.slice(); // copy to prevent concurrent modifications
    listeners.forEach(listener => {
      let callback = listener.callback;
      let context = listener.context;
      if (callback) {
        try {
          if (context) {
            callback.apply(context, [data]);
          } else {
            callback(data);
          }
        }
        catch (error) {
          Logger.error('Unable to forward event: {0}', error);
        }
      }
    });
  }

  /**
   * @memberOf Listeners#
   * @param callback
   * @param context
   */
  add(callback: (data: T) => void, context ?: any) {
    let listener = {
      callback,
      context
    } as Listener<T>;
    Preconditions.checkNotNull(listener, 'listener cannot be null');
    Preconditions.checkExpression(this._listeners.indexOf(listener) === -1, 'listener already exists');
    this._listeners.push(listener);
  }

  /**
   * @memberOf Listeners#
   * @param callback
   * @param context
   */
  remove(callback: (data: T) => void, context ?: any) {
    let listener = {
      callback,
      context
    } as Listener<T>;
    Preconditions.checkNotNull(listener, 'listener cannot be null');
    let indexOf = this._listeners.indexOf(listener);
    Preconditions.checkExpression(indexOf >= 0, 'listener not exists');
    this._listeners.splice(indexOf, 1);
  }
}

export interface Listener<T> {
  callback: (data: T) => void;
  context?: any;
}


