var Exporter = (function() {
  'use strict';

  return {
    /**
     * @function
     * Google Closure Compiler helpers (used only to make the minified file smaller)
     * @param {string} publicPath
     * @param {*} object
     */ 
    exportSymbol: function(owner, publicPath, object) {
      var tokens = publicPath.split(".");
      var target = owner;
      for (var i = 0; i < tokens.length - 1; i++) {
        target = target[tokens[i]];
      }
      this.exportProperty(target, tokens[tokens.length - 1], object);
    },
    
    /**
     * @function
     * Google Closure Compiler helpers (used only to make the minified file smaller)
     * @param {Object} owner
     * @param {string} publicName
     * @param {*} object
     */
    exportProperty: function(owner, publicName, object) {
      owner[publicName] = object;
    }
    
  };
})();