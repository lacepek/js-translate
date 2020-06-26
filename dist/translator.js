"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function translate(key, locale, translations, params) {
    if (key === null || key === undefined) {
        return key;
    }
    var keys = key.split('.');
    var translation = keys.reduce(searchForKey, translations[locale]);
    if (!translation) {
        return key;
    }
    if (params) {
        if (translation instanceof Function) {
            return translation(params);
        }
        return injectParamsToTranslation(params, translation);
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
function injectParamsToTranslation(params, translation) {
    var keys = Object.keys(params);
    return keys.reduce(function (accumulator, key) {
        var needle = "{{" + key + "}}";
        if (accumulator.includes(needle)) {
            var value = params[key];
            return accumulator.replace(needle, value);
        }
        return accumulator;
    }, translation);
}
