export type Options = {
    interpolation?: Interpolation;
    localeModificator?: (locale: string) => string;
};

export type Interpolation = {
    prefix?: string;
    suffix?: string;
};

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

    if (params && Object.keys(params).includes("count")) {
        const rules = new Intl.PluralRules((localeModificator && localeModificator(locale)) || locale);
        const count = params["count"];
        const rule = rules.select(count);
        
        key += `_${rule}`;
    }

    const keys = key.split(".");
    const translation = keys.reduce(searchForKey, translations[locale]);

    if (!translation) {
        return key;
    }

    if (params) {
        if (translation instanceof Function) {
            return translation(params);
        }

        return injectParamsToTranslation(params, translation, options?.interpolation);
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
