export type Options = {
    interpolation?: Interpolation;
    localeModificator?: (locale: string) => string;
};

export type Interpolation = {
    prefix?: string;
    suffix?: string;
};

const COUNT_KEY = "count";
const CONTEXT_KEY = "context";
const CAPITALIZE_KEY = "capitalize";

export function translate(
    key: string,
    locale: string,
    translations: { [key: string]: any },
    params?: { [key: string]: any },
    options: Options = {}
) {
    const { localeModificator } = options;

    if (key === null || key === undefined) {
        return null;
    }

    if (params) {
        const paramsKeys = Object.keys(params);
        if (paramsKeys.includes(CONTEXT_KEY)) {
            const context = params[CONTEXT_KEY];
            key += `_${context}`;
        }

        if (paramsKeys.includes(COUNT_KEY)) {
            const rules = new Intl.PluralRules((localeModificator && localeModificator(locale)) || locale);
            const count = params[COUNT_KEY];
            const rule = rules.select(count);

            key += `_${rule}`;
        }
    }

    const keys = key.split(".");
    let translation = keys.reduce(searchForKey, translations[locale]);

    if (!translation) {
        return key;
    }

    if (params) {
        if (translation instanceof Function) {
            return translation(params);
        }

        translation = injectParamsToTranslation(params, translation, options?.interpolation);

        if (Object.keys(params).includes(CAPITALIZE_KEY) && params[CAPITALIZE_KEY] === true) {
            if (typeof translation === "string") {
                translation = translation.charAt(0).toUpperCase() + translation.slice(1);
            }
        }
    }

    return translation;
}

function searchForKey(current: string, key: string) {
    if (!current || !current[key]) {
        return null;
    }

    return current[key];
}

function injectParamsToTranslation(params: { [key: string]: any }, translation: string, interpolation: Interpolation) {
    const keys = Object.keys(params);
    return keys.reduce((accumulator: string, key: string) => {
        const needlePrefix = interpolation?.prefix || "{{";
        const needleSuffix = interpolation?.suffix || "}}";
        const needle = `${needlePrefix}${key}${needleSuffix}`;

        if (accumulator.includes(needle)) {
            const value = params[key];
            return accumulator.replace(needle, value);
        }

        return accumulator;
    }, translation);
}
