import {Logger} from './logger';
import {Preconditions} from './preconditions';

describe('Preconditions', () => {

  describe('CheckNotNull', () => {
    it('should not throw an exception when the value is not null', () => {
      // GIVEN
      const notNullValue: string = 'Hello World!';

      // THEN
      // see https://ajsblackbelt.wordpress.com/2014/05/18/jasmine-tests-expect-tothrow/
      expect(() => {
        Preconditions.checkNotNull(notNullValue, 'notNullValue cannot be null');
      }).not.toThrow('notNullValue cannot be null');
    });

    it('should throw an exception when the value is null', () => {
      // GIVEN
      const nullValue: string = null;

      // THEN
      expect(() => {
        Preconditions.checkNotNull(nullValue, 'nullValue cannot be null');
      }).toThrow('nullValue cannot be null');
    });

    it('should throw an exception when the value is undefined', () => {
      // GIVEN
      let nullValue: string;

      // THEN
      expect(() => {
        Preconditions.checkNotNull(nullValue, 'nullValue cannot be null');
      }).toThrow('nullValue cannot be null');
    });

    it('should throw an exception with default message when the value is null', () => {
      // GIVEN
      let nullValue: string;

      // THEN
      expect(() => {
        Preconditions.checkNotNull(nullValue, null);
      }).toThrow('value cannot be null');
    });
  });

  describe('checkExpression', () => {
    const value = 'Hello';
    const message = 'hello must be equal to Hello';

    it('should not throw an exception when the expression is verified', () => {
      // GIVEN
      const hello = 'Hello';

      // THEN
      expect(() => {
        Preconditions.checkExpression(hello === 'Hello', 'hello must be equal to Hello');
      }).not.toThrow('hello must be equal to Hello');
    });

    it('should throw an exception when the expression is not verified', () => {
      // GIVEN
      const hello = 'Hello';

      // THEN
      expect(() => {
        Preconditions.checkExpression(hello !== 'Hello', 'hello must be equal to Hello');
      }).toThrow('hello must be equal to Hello');
    });

    it('should throw an exception with default message when the expression is not verified', () => {
      // GIVEN
      const hello = 'Hello';

      // THEN
      expect(() => {
        Preconditions.checkExpression(hello !== 'Hello', null);
      }).toThrow('expression is not valid');
    });
  });

  describe('deprecated', () => {
    it('should log a warning when called', () => {
      // GIVEN
      spyOn(Logger, 'warn');

      // WHEN
      Preconditions.deprecated('foo', 'foo is not used anymore');

      // THEN
      expect(Logger.warn).toHaveBeenCalled();
    });
  });

});
