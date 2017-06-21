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

    try {
      return JSON.parse(stringObj);
    } catch (err) {
      return stringObj;
    }
  }

  public static stringify(obj: any) {
    return obj ? JSON.stringify(obj) : 'undefined';
  }
}