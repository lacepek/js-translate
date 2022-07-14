export type Options = {
    interpolation?: Interpolation;
    capitalize?: boolean;
    context?: string | string[];
};

export type Interpolation = {
    prefix?: string;
    suffix?: string;
};

type Params = { [key: string]: any };
type Translations = { [key: string]: any };

const COUNT_KEY = "count";

export function translate(
    key: string,
    locale: string,
    translations: Translations,
    params?: Params,
    options: Options = {}
) {
    if (key === null || key === undefined) {
        return null;
    }

    let translation = null;

    translation = tryGetTranslation(key, options?.context, params, translations, locale);

    if (!translation) {
        return key;
    }

    if (translation instanceof Function) {
        return translation(params);
    }

    translation = injectParamsToTranslation(params, translation, options?.interpolation);

    if (options?.capitalize === true) {
        if (typeof translation === "string") {
            translation = capitalize(translation);
        }
    }

    return translation;
}

function tryGetTranslation(
    key: string,
    context: string | string[],
    params: Params,
    translations: Translations,
    locale: string
) {
    let _context: string[] | null = null;
    if (typeof context === "string") {
        _context = [context];
    } else if (context instanceof Array) {
        _context = context;
    }

    let translation = null;
    for (let i = 0, n = _context?.length || 1; i <= n; i++) {
        let modifiedKey = "" + key;

        modifiedKey = modifyKeyWithContext(modifiedKey, _context);
        if (params) {
            const paramsKeys = Object.keys(params);

            if (paramsKeys.includes(COUNT_KEY)) {
                const rules = new Intl.PluralRules(locale);
                const count = params[COUNT_KEY];
                const rule = rules.select(count);

                modifiedKey += `_${rule}`;
            }
        }

        translation = getTranslation(modifiedKey, translations[locale]);
        if (translation !== null && translation !== undefined) {
            return translation;
        }

        _context?.pop();
    }

    translation = getTranslation(key, translations[locale]);

    return translation;
}

function modifyKeyWithContext(key: string, context: string[] | null) {
    if (context && context.length > 0) {
        return `${key}_${context.join("_")}`;
    }

    return key;
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getTranslation(key: string, translations: Translations) {
    const keys = key.split(".");
    return keys.reduce(searchForKey, translations);
}

function searchForKey(current: string, key: string) {
    if (!current || !current[key]) {
        return null;
    }

    return current[key];
}

function injectParamsToTranslation(params: Params, translation: string, interpolation: Interpolation) {
    if (!params || Object.keys(params).length === 0) {
        return translation;
    }

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
