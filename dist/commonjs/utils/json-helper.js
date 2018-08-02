"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preconditions_1 = require("./preconditions");
var JsonHelper = /** @class */ (function () {
    function JsonHelper() {
    }
    JsonHelper.validate = function (stringObj) {
        try {
            JsonHelper.parse(stringObj);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    JsonHelper.parse = function (stringObj) {
        preconditions_1.Preconditions.checkNotNull(stringObj, 'string parameter cannot be null');
        return JSON.parse(stringObj);
    };
    JsonHelper.stringify = function (obj) {
        return obj ? JSON.stringify(obj) : 'undefined';
    };
    return JsonHelper;
}());
exports.JsonHelper = JsonHelper;
//# sourceMappingURL=json-helper.js.map