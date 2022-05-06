export declare type Options = {
    interpolation?: Interpolation;
};
export declare type Interpolation = {
    prefix?: string;
    suffix?: string;
};
export declare function translate(key: string, locale: string, translations: {
    [key: string]: any;
}, params?: {
    [key: string]: any;
}, options?: Options): any;
