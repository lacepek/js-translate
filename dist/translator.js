"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
var COUNT_KEY = "count";
function translate(key, locale, translations, params, options) {
    if (options === void 0) { options = {}; }
    if (key === null || key === undefined) {
        return null;
    }
    var translation = null;
    translation = tryGetTranslation(key, options === null || options === void 0 ? void 0 : options.context, params, translations, locale);
    if (!translation) {
        return key;
    }
    if (translation instanceof Function) {
        return translation(params);
    }
    translation = injectParamsToTranslation(params, translation, options === null || options === void 0 ? void 0 : options.interpolation);
    if ((options === null || options === void 0 ? void 0 : options.capitalize) === true) {
        if (typeof translation === "string") {
            translation = capitalize(translation);
        }
    }
    return translation;
}
exports.translate = translate;
function tryGetTranslation(key, context, params, translations, locale) {
    var _context = null;
    if (typeof context === "string") {
        _context = [context];
    }
    else if (context instanceof Array) {
        _context = context;
    }
    var translation = null;
    for (var i = 0, n = (_context === null || _context === void 0 ? void 0 : _context.length) || 1; i <= n; i++) {
        var modifiedKey = "" + key;
        modifiedKey = modifyKeyWithContext(modifiedKey, _context);
        if (params) {
            var paramsKeys = Object.keys(params);
            if (paramsKeys.includes(COUNT_KEY)) {
                var rules = new Intl.PluralRules(locale);
                var count = params[COUNT_KEY];
                var rule = rules.select(count);
                modifiedKey += "_".concat(rule);
            }
        }
        translation = getTranslation(modifiedKey, translations[locale]);
        if (translation !== null && translation !== undefined) {
            return translation;
        }
        _context === null || _context === void 0 ? void 0 : _context.pop();
    }
    translation = getTranslation(key, translations[locale]);
    return translation;
}
function modifyKeyWithContext(key, context) {
    if (context && context.length > 0) {
        return "".concat(key, "_").concat(context.join("_"));
    }
    return key;
}
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function getTranslation(key, translations) {
    var keys = key.split(".");
    return keys.reduce(searchForKey, translations);
}
function searchForKey(current, key) {
    if (!current || !current[key]) {
        return null;
    }
    return current[key];
}
function injectParamsToTranslation(params, translation, interpolation) {
    if (!params || Object.keys(params).length === 0) {
        return translation;
    }
    var keys = Object.keys(params);
    return keys.reduce(function (accumulator, key) {
        var needlePrefix = (interpolation === null || interpolation === void 0 ? void 0 : interpolation.prefix) || "{{";
        var needleSuffix = (interpolation === null || interpolation === void 0 ? void 0 : interpolation.suffix) || "}}";
        var needle = "".concat(needlePrefix).concat(key).concat(needleSuffix);
        if (accumulator.includes(needle)) {
            var value = params[key];
            return accumulator.replace(needle, value);
        }
        return accumulator;
    }, translation);
}
