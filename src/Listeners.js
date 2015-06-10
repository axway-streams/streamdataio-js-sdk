function Listeners(bind) {
    Preconditions.checkNotNull(bind, "bind cannot be null");

    this._bind      = bind;
    this._listeners = [];
}
  
Listeners.prototype = {
    /**
    * @memberOf Listeners#
    */
    fire: function() {
        var listeners = this._listeners.slice(); // copy to prevent concurrent modifications
        for(var i = 0, length = listeners.length; i < length; i++) {
            try {
                var listener = listeners[i];
                if(listener) {
                    listener.apply(this._bind, arguments);
                }
            } catch(error) {
                Logger.error("Unable to forward event: {0}", error);
            }
        }
    },
    /**
    * @memberOf Listeners#
    * @param {Function} listener
    */
    add: function(listener) {
        Preconditions.checkNotNull(listener, "listener cannot be null");
        Preconditions.checkState(this._listeners.indexOf(listener) == -1, "listener already exists");
        this._listeners.push(listener);
    },
    /**
    * @memberOf Listeners#
    * @param {Function} listener
    */
    remove: function(listener) {
        Preconditions.checkNotNull(listener, "listener cannot be null");
        var indexOf = this._listeners.indexOf(listener);
        Preconditions.checkState(indexOf >= 0, "listener not exists");
        this._listeners.splice(indexOf, 1);
    }
};
