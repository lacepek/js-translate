"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
var COUNT_KEY = "count";
var CONTEXT_KEY = "context";
var CAPITALIZE_KEY = "capitalize";
function translate(key, locale, translations, params, options) {
    if (options === void 0) { options = {}; }
    var localeModificator = options.localeModificator;
    if (key === null || key === undefined) {
        return null;
    }
    if (params) {
        var paramsKeys = Object.keys(params);
        if (paramsKeys.includes(CONTEXT_KEY)) {
            var context = params[CONTEXT_KEY];
            key += "_".concat(context);
        }
        if (paramsKeys.includes(COUNT_KEY)) {
            var rules = new Intl.PluralRules((localeModificator && localeModificator(locale)) || locale);
            var count = params[COUNT_KEY];
            var rule = rules.select(count);
            key += "_".concat(rule);
        }
    }
    var keys = key.split(".");
    var translation = keys.reduce(searchForKey, translations[locale]);
    if (!translation) {
        return key;
    }
    if (params) {
        if (translation instanceof Function) {
            return translation(params);
        }
        translation = injectParamsToTranslation(params, translation, options === null || options === void 0 ? void 0 : options.interpolation);
        if (Object.keys(params).includes(CAPITALIZE_KEY) && params[CAPITALIZE_KEY] === true) {
            if (typeof translation === "string") {
                translation = translation.charAt(0).toUpperCase() + translation.slice(1);
            }
        }
    }
    return translation;
}
exports.translate = translate;
function searchForKey(current, key) {
    if (!current || !current[key]) {
        return null;
    }
    return current[key];
}
function injectParamsToTranslation(params, translation, interpolation) {
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
