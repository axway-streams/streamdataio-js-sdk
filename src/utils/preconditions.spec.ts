import {Preconditions} from './preconditions';
import {Logger} from './logger';
describe('Preconditions', function () {

  describe('CheckNotNull', function () {
    it('should not throw an exception when the value is not null', function () {
      // GIVEN
      var notNullValue: string  = 'Hello World!';

      // see https://ajsblackbelt.wordpress.com/2014/05/18/jasmine-tests-expect-tothrow/
      expect(function () {
        Preconditions.checkNotNull(notNullValue, 'notNullValue cannot be null');
      }).not.toThrow();
    });

    it('should throw an exception when the value is null', function () {
      // GIVEN
      var nullValue: string = null;

      expect(function () {
        Preconditions.checkNotNull(nullValue, 'nullValue cannot be null');
      }).toThrow();
    });

    it('should throw an exception when the value is undefined', function () {
      // GIVEN
      var nullValue: string;

      expect(function () {
        Preconditions.checkNotNull(nullValue, 'nullValue cannot be null');
      }).toThrow();
    });
  });

  describe('checkExpression', function () {
    it('should not throw an exception when the expression is verified', function () {
      // GIVEN
      var hello = 'Hello';

      expect(function () {
        Preconditions.checkExpression(hello === 'Hello', 'hello must be equal to Hello');
      }).not.toThrow();
    });

    it('should throw an exception when the expression is not verified', function () {
      // GIVEN
      var hello = 'Hello';

      expect(function () {
        Preconditions.checkExpression(hello !== 'Hello', 'hello must be equal to Hello');
      }).toThrow();
    });
  });

  describe('deprecated', function () {
    it('should log a warning when called', function () {
      // GIVEN
      spyOn(Logger, 'warn');

      // WHEN
      Preconditions.deprecated('foo', 'foo is not used anymore');

      expect(Logger.warn).toHaveBeenCalled();
    });
  });

});
