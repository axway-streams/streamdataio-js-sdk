import {JsonHelper} from './json-helper';

describe('JsonHelper', () => {

  describe('Validate', () => {
    it('should return true when the param is a json string', () => {
      // GIVEN
      const stringObj: string = '{"key": "value"}';

      // THEN
      expect(JsonHelper.validate(stringObj)).toBeTruthy();
    });

    it('should return false when the param is not a json string', () => {
      // GIVEN
      const stringObj: string = '{\'key\': }';

      // THEN
      expect(JsonHelper.validate(stringObj)).toBeFalsy();
    });

  });

  describe('Parse', () => {
    it('should return Json Object when the param is a json string', () => {
      // GIVEN
      const stringObj: string = '{"key": "value"}';

      // WHEN
      let jsonReturned = JsonHelper.parse(stringObj);

      // THEN
      const json = {'key': 'value'};
      expect(jsonReturned).toEqual(json);
    });

    it('should throw error when the param is not a json string', () => {
      // GIVEN
      const stringObj: string = '{\'key\': }';

      // THEN
      expect(() => {
        JsonHelper.parse(stringObj);
      }).toThrow();
    });
  });

  describe('Stringify', () => {
    it('should return json string representation of the parameter', () => {
      // GIVEN
      const obj = {'key': 'value'};

      // WHEN
      let stringReturned = JsonHelper.stringify(obj);

      // THEN
      const stringObj: string = '{"key":"value"}';
      expect(stringReturned).toEqual(stringObj);
    });

    it('should return undefined when parameter is null', () => {

      // GIVEN
      const obj: any = null;

      // WHEN
      let stringReturned = JsonHelper.stringify(obj);

      // THEN
      expect(stringReturned).toEqual('undefined');
    });

    it('should return undefined when parameter is undefined', () => {

      // GIVEN
      const obj: any = undefined;

      // WHEN
      let stringReturned = JsonHelper.stringify(obj);

      // THEN
      expect(stringReturned).toEqual('undefined');
    });
  });


});
