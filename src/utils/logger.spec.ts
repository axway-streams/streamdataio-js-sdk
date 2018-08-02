import {Logger, LogLevel} from './logger';

describe('Logger', () => {

  describe('Debug', () => {
    it('should log a debug when called with a message', () => {
      // GIVEN
      Logger.level = LogLevel.DEBUG;
      spyOn(console, 'debug');

      // WHEN
      Logger.debug('debug message');

      // THEN
      expect(console.debug).toHaveBeenCalledWith('[DEBUG] debug message');
    });

    it('should log a debug when called with a message and parameters', () => {
      // GIVEN
      Logger.level = LogLevel.DEBUG;
      spyOn(console, 'debug');

      // WHEN
      Logger.debug('debug message {0} {1}', 'param1', 'param2');

      // THEN
      expect(console.debug).toHaveBeenCalledWith('[DEBUG] debug message param1 param2');
    });

    it('should not log a debug when called with a message and log level is higher', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'debug');

      // WHEN
      Logger.debug('debug message');

      // THEN
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('should not log a debug when called with a message and there is no console', () => {
      // GIVEN
      Logger.level = LogLevel.DEBUG;
      Logger.console = null;

      // THEN
      expect(() => {
        Logger.debug('debug message');
      }).not.toThrow();

      Logger.console = console;
    });

    it('should log a info when called with a message and console.debug is null', () => {
      // GIVEN
      Logger.level = LogLevel.DEBUG;
      spyOn(console, 'log');
      Logger.console.debug = null;

      // WHEN
      Logger.debug('debug message');

      // THEN
      expect(console.log).toHaveBeenCalledWith('[DEBUG] debug message');
    });
  });

  describe('Info', () => {
    it('should log a info when called with a message', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'info');

      // WHEN
      Logger.info('info message');

      // THEN
      expect(console.info).toHaveBeenCalledWith('[INFO] info message');
    });

    it('should log a info when called with a message and parameters', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'info');

      // WHEN
      Logger.info('info message {0} {1}', 'param1', 'param2');

      // THEN
      expect(console.info).toHaveBeenCalledWith('[INFO] info message param1 param2');
    });

    it('should not log a info when called with a message and log level is higher', () => {
      // GIVEN
      Logger.level = LogLevel.WARN;
      spyOn(console, 'info');

      // WHEN
      Logger.info('info message');

      // THEN
      expect(console.info).not.toHaveBeenCalled();
    });

    it('should not log a info when called with a message and there is no console', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      Logger.console = null;

      // THEN
      expect(() => {
        Logger.info('info message');
      }).not.toThrow();

      Logger.console = console;
    });
  });

  describe('Warn', () => {
    it('should log a warn when called with a message', () => {
      // GIVEN
      Logger.level = LogLevel.WARN;
      spyOn(console, 'warn');

      // WHEN
      Logger.warn('warn message');

      // THEN
      expect(console.warn).toHaveBeenCalledWith('[WARN] warn message');
    });

    it('should log a warn when called with a message and parameters', () => {
      // GIVEN
      Logger.level = LogLevel.WARN;
      spyOn(console, 'warn');

      // WHEN
      Logger.warn('warn message {0} {1}', 'param1', 'param2');

      // THEN
      expect(console.warn).toHaveBeenCalledWith('[WARN] warn message param1 param2');
    });

    it('should not log a warn when called with a message and log level is higher', () => {
      // GIVEN
      Logger.level = LogLevel.ERROR;
      spyOn(console, 'warn');

      // WHEN
      Logger.warn('warn message');

      // THEN
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should not log a warn when called with a message and there is no console', () => {
      // GIVEN
      Logger.level = LogLevel.WARN;
      Logger.console = null;

      // THEN
      expect(() => {
        Logger.warn('warn message');
      }).not.toThrow();

      Logger.console = console;
    });
  });

  describe('Error', () => {
    it('should log an error when called with a message', () => {
      // GIVEN
      Logger.level = LogLevel.ERROR;
      spyOn(console, 'error');

      // WHEN
      Logger.error('error message');

      // THEN
      expect(console.error).toHaveBeenCalledWith('[ERROR] error message');
    });

    it('should log an error when called with a message and parameters', () => {
      // GIVEN
      Logger.level = LogLevel.ERROR;
      spyOn(console, 'error');

      // WHEN
      Logger.error('error message {0} {1}', 'param1', 'param2');

      // THEN
      expect(console.error).toHaveBeenCalledWith('[ERROR] error message param1 param2');
    });

    it('should not log an error when called with a message and there is no console', () => {
      // GIVEN
      Logger.level = LogLevel.ERROR;
      Logger.console = null;

      // THEN
      expect(() => {
        Logger.error('error message');
      }).not.toThrow();

      Logger.console = console;
    });
  });


  describe('FormatLog', () => {
    it('should log message with Error as param', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'error');

      // WHEN
      Logger.error('message [{0}]', new Error('error object'));

      // THEN
      expect(console.error).toHaveBeenCalled();
    });

    it('should log message with Error without stack as param', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'error');

      // WHEN
      let error = new Error('error object');
      error.stack = null;
      Logger.error('message [{0}]', error);

      // THEN
      expect(console.error).toHaveBeenCalled();
    });

    it('should log message with object as param', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'info');

      // WHEN
      Logger.info('message [{0}]', {'key': 'value'});

      // THEN
      expect(console.info).toHaveBeenCalledWith('[INFO] message [{"key":"value"}]');
    });

    it('should log message with string as param', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'info');

      // WHEN
      Logger.info('message [{0}]', 'param');

      // THEN
      expect(console.info).toHaveBeenCalledWith('[INFO] message [param]');
    });

    it('should log message with function as param', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'info');

      // WHEN
      Logger.info('message [{0}]', () => true);

      // THEN
      expect(console.info).toHaveBeenCalledWith('[INFO] message [function]');
    });

    it('should log message with function as param', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'info');

      // WHEN
      Logger.info('message [{0}]', () => true);

      // THEN
      expect(console.info).toHaveBeenCalledWith('[INFO] message [function]');
    });

    it('should log message with no param', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'info');

      // WHEN
      Logger.info('message [{0}]');

      // THEN
      expect(console.info).toHaveBeenCalledWith('[INFO] message [{0}]');
    });

    it('should log message without substition if param as no replace method', () => {
      // GIVEN
      Logger.level = LogLevel.INFO;
      spyOn(console, 'info');

      // WHEN
      Logger.info('message [{0}]');

      // THEN
      expect(console.info).toHaveBeenCalledWith('[INFO] message [{0}]');
    });

  });

});
