'use strict';

describe('Preconditions.', function () {

  describe('CheckNotNull', function() {
    it('should not throw an exception when the value is not null', function () {
      //GIVEN
      var notNullValue = 'Hello World!';

      // see https://ajsblackbelt.wordpress.com/2014/05/18/jasmine-tests-expect-tothrow/
      expect(function() {
        Preconditions.checkNotNull(notNullValue, 'notNullValue cannot be null');
      }).not.toThrow();
    });

    it('should throw an exception when the value is null', function () {
      //GIVEN
      var nullValue = null;

      expect(function() {
        Preconditions.checkNotNull(nullValue, 'nullValue cannot be null');
      }).toThrow();
    });

    it('should throw an exception when the value is undefined', function () {
      //GIVEN
      var nullValue;

      expect(function() {
        Preconditions.checkNotNull(nullValue, 'nullValue cannot be null');
      }).toThrow();
    });
  });

  describe('CheckState', function() {
    it('should not throw an exception when the state is verified', function () {
      //GIVEN
      var isOK = true;

      expect(function() {
        Preconditions.checkState(isOK === true, 'isOK cannot be false');
      }).not.toThrow();
    });

    it('should throw an exception when the state is not verified', function () {
      //GIVEN
      var isOK = true;

      expect(function() {
        Preconditions.checkState(isOK === false, 'isOK cannot be false');
      }).toThrow();
    });
  });

  describe('CheckArgument', function() {
    it('should not throw an exception when the expression is verified', function () {
      //GIVEN
      var hello = 'Hello';

      expect(function() {
        Preconditions.checkArgument(hello === 'Hello', 'hello must be equal to Hello');
      }).not.toThrow();
    });

    it('should throw an exception when the state is not verified', function () {
      //GIVEN
      var hello = 'Hello';

      expect(function() {
        Preconditions.checkArgument(hello !== 'Hello', 'hello must be equal to Hello');
      }).toThrow();
    });
  });

  describe('deprecated', function() {
    it('should log a warning when called', function () {
      // GIVEN
      spyOn(Logger, 'warn');

      // WHEN
      Preconditions.deprecated('foo', 'foo is not used anymore');

      expect(Logger.warn).toHaveBeenCalled();
    });

    it('should throw an exception when the state is not verified', function () {
      //GIVEN
      var hello = 'Hello';

      expect(function() {
        Preconditions.checkArgument(hello !== 'Hello', 'hello must be equal to Hello');
      }).toThrow();
    });
  });

});
