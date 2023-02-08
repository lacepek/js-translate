export type Options = {
    interpolation?: Interpolation;
    capitalize?: boolean;
    context?: string | string[];
    ordinal?: boolean;
    fallbackLocale?: string;
    fallbackValue?: any;
};
export type Interpolation = {
    prefix?: string;
    suffix?: string;
};
type Params = {
    [key: string]: any;
};
type Translations = {
    [key: string]: any;
};
export declare function translate(key: string, locale: string, translations: Translations, params?: Params, options?: Options): any;
export {};
