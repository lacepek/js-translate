export declare type Options = {
    interpolation?: Interpolation;
    capitalize?: boolean;
    context?: string | string[];
};
export declare type Interpolation = {
    prefix?: string;
    suffix?: string;
};
declare type Params = {
    [key: string]: any;
};
declare type Translations = {
    [key: string]: any;
};
export declare function translate(key: string, locale: string, translations: Translations, params?: Params, options?: Options): any;
export {};
