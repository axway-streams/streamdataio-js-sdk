import { Preconditions } from './preconditions';
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
        Preconditions.checkNotNull(stringObj, 'string parameter cannot be null');
        return JSON.parse(stringObj);
    };
    JsonHelper.stringify = function (obj) {
        return obj ? JSON.stringify(obj) : 'undefined';
    };
    return JsonHelper;
}());
export { JsonHelper };
//# sourceMappingURL=json-helper.js.map