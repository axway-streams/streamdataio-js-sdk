import {Preconditions} from './preconditions';

export class JsonHelper {

  public static validate(stringObj: string) {
    try {
      JsonHelper.parse(stringObj);
      return true;
    } catch (error) {
      return false;
    }
  }

  public static parse(stringObj: string) {
    Preconditions.checkNotNull(stringObj, 'string parameter cannot be null');
    return JSON.parse(stringObj);
  }

  public static stringify(obj: any) {
    return obj ? JSON.stringify(obj) : 'undefined';
  }
}