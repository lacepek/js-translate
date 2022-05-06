"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
function translate(key, locale, translations, params, options) {
    if (key === null || key === undefined) {
        return null;
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
        return injectParamsToTranslation(params, translation, options === null || options === void 0 ? void 0 : options.interpolation);
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
