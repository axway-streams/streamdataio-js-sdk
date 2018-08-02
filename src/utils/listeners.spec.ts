import {Listeners} from './listeners';
import {Logger} from './logger';

describe('Listeners', () => {

  describe('Constructor', () => {

    it('should be created with empty list', () => {

      // GIVEN
      const listeners = new Listeners<string>();

      // THEN
      expect(listeners.listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(0);
    });

  });

  describe('addCallback', () => {

    it('should add a new listener with callback but no context', () => {

      // GIVEN
      const listeners = new Listeners<string>();

      // WHEN
      listeners.addCallback(data => {
      });

      // THEN
      expect(listeners.listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(1);
    });

    it('should add a new listener with callback and context', () => {

      // GIVEN
      const listeners = new Listeners<string>();

      // WHEN
      listeners.addCallback(data => {
      }, this);

      // THEN
      expect(listeners.listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(1);
    });

    it('should not add a new listener without callback', () => {

      // GIVEN
      const listeners = new Listeners<string>();

      // THEN
      expect(() => {
        listeners.add(null);
      }).toThrow('listener cannot be null');
      expect(() => {
        listeners.add(undefined);
      }).toThrow('listener cannot be null');
    });


  });

  describe('Remove', () => {

    it('should remove a existing listener with callback but no context', () => {

      // GIVEN
      const listeners = new Listeners<string>();
      const listener = listeners.addCallback((data: string) => {
      });
      // THEN
      expect(listeners.listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(1);

      // WHEN
      listeners.remove(listener);

      // THEN
      expect(listeners.listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(0);
    });

    it('should not remove anything without listener', () => {

      // GIVEN
      const listeners = new Listeners<string>();

      // THEN
      expect(() => {
        listeners.remove(null);
      }).toThrow('listener cannot be null');
      expect(() => {
        listeners.remove(undefined);
      }).toThrow('listener cannot be null');
    });


  });

  describe('Fire', () => {

    it('should fire event to existing listener', () => {

      // GIVEN
      const listeners = new Listeners<string>();
      let callback = jest.fn();
      listeners.addCallback(callback);

      // WHEN
      listeners.fire('event');

      // THEN
      expect(listeners.listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(1);
      expect(callback).toHaveBeenCalledWith('event');
    });

    it('should fire event to existing listener with context', () => {
      this.text = 'text';
      // GIVEN
      const listeners = new Listeners<string>();
      const callback = jest.fn(function (data: string) {
        this.fct(data);
      });
      const context = {
        fct: jest.fn()
      };
      listeners.addCallback(callback, context);

      // WHEN
      listeners.fire('event');

      // THEN
      expect(listeners.listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(1);
      expect(callback).toHaveBeenCalledWith('event');
      expect(context.fct).toHaveBeenCalled();
    });

    it('should log an error when firing an event to existing listener with a wrong context', () => {

      // GIVEN
      const listeners = new Listeners<string>();
      const callback = jest.fn(function (data: string) {
        this.fct(data);
      });
      listeners.addCallback(callback, {});
      Logger.error = jest.fn();

      //WHEN
      listeners.fire('event');

      // THEN
      expect(listeners.listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(1);
      expect(callback).toHaveBeenCalledWith('event');
      expect(Logger.error).toHaveBeenCalledWith('Unable to fire event: {0}', new TypeError('this.fct is not a function'));
    });

    it('should not fire event without listeners', () => {

      // GIVEN
      const listeners = new Listeners<string>();

      // WHEN
      listeners.fire('event');

      // THEN
      expect(listeners.listeners).toBeDefined();
      expect(listeners.listeners.length).toEqual(0);
    });


  });

});
