import { translate } from "./translator";

const translations = {
    en: {
        test: {
            apple: "Apple",
            pears: (params: { [key: string]: any }) => {
                const count = params.value;
                if (count !== 1) {
                    return `You have ${count} pears`;
                }
                return "You have 1 pear";
            },
            time: "Its {{hours}}:{{minutes}}",
        },
        interpolation: {
            prefix: "{param}}",
            suffix: "{{param}",
            both: "{param}",
        },
        count: {
            apple_one: "1 apple",
            apple_other: "{{count}} apples",
        },
        context: {
            friend: "A friend",
            friend_male: "A boyfriend",
            friend_female: "A girlfriend",
            friend_male_one: "A boyfriend",
            friend_female_one: "A girlfriend",
            friend_male_other: "{{count}} boyfriends",
            friend_female_other: "{{count}} girlfriends",
        },
        capitalize: {
            apple: "{{color}} apple",
            pear: "pear"
        }
    },
    cs: {
        test: {
            apple: "Jablko",
            pears: (params: { [key: string]: any }) => {
                const count = params.value;
                if (count === 1) {
                    return "Máš jednu hrušku";
                }
                if (count === 0 || count > 4) {
                    return `Máš ${count} hrušek`;
                }

                return `Máš ${count} hrušky`;
            },
            time: "Je {{hours}}:{{minutes}}",
        },
        count: {
            apple_one: "1 jablko",
            apple_few: "{{count}} jablka",
            apple_other: "{{count}} jablek",
        },
        capitalize: {
            apple: "{{color}} jablko",
            pear: "hruška"
        }
    },
};

describe("Translator test", () => {
    it("translates simple key", () => {
        const en = "Apple";
        const cs = "Jablko";

        expect(translate("test.apple", "en", translations)).toBe(en);
        expect(translate("test.apple", "cs", translations)).toBe(cs);
    });

    it("translates key with params", () => {
        const en = "Its 8:00";
        const cs = "Je 8:00";
        const params = { hours: 8, minutes: "00" };

        expect(translate("test.time", "en", translations, params)).toBe(en);
        expect(translate("test.time", "cs", translations, params)).toBe(cs);
    });

    it("translates key with callback", () => {
        const enSingular = "You have 1 pear";
        const enPlural = "You have 8 pears";

        const csSingular = "Máš jednu hrušku";
        const csPlural = "Máš 4 hrušky";

        expect(translate("test.pears", "en", translations, { value: 1 })).toBe(enSingular);
        expect(translate("test.pears", "en", translations, { value: 8 })).toBe(enPlural);
        expect(translate("test.pears", "cs", translations, { value: 1 })).toBe(csSingular);
        expect(translate("test.pears", "cs", translations, { value: 4 })).toBe(csPlural);
    });

    it("returns key when nothing is found", () => {
        expect(translate("test.not.found", "en", translations)).toBe("test.not.found");
        expect(translate("test.not.found", "en", translations, { value: 8 })).toBe("test.not.found");
        expect(translate("test.not.found", "en", translations, { hours: 8, minutes: "00" })).toBe("test.not.found");
        expect(translate("test.not.found", "cs", translations)).toBe("test.not.found");
        expect(translate("test.not.found", "cs", translations, { value: 4 })).toBe("test.not.found");
        expect(translate("test.not.found", "cs", translations, { hours: 8, minutes: "00" })).toBe("test.not.found");
    });

    it("returns null", () => {
        expect(translate(undefined, "en", translations)).toBe(null);
        expect(translate(null, "en", translations)).toBe(null);
    });

    it("uses custom interpolation", () => {
        expect(
            translate(
                "interpolation.prefix",
                "en",
                translations,
                { param: "prefix" },
                { interpolation: { prefix: "{" } }
            )
        ).toBe("prefix");
        expect(
            translate(
                "interpolation.suffix",
                "en",
                translations,
                { param: "suffix" },
                { interpolation: { suffix: "}" } }
            )
        ).toBe("suffix");
        expect(
            translate(
                "interpolation.both",
                "en",
                translations,
                { param: "both" },
                { interpolation: { prefix: "{", suffix: "}" } }
            )
        ).toBe("both");
    });

    it("uses cs plural rules", () => {
        for (let count = 0; count <= 5; count++) {
            const apples = translate("count.apple", "cs", translations, { count });

            if (count === 1) {
                expect(apples).toBe("1 jablko");
                continue;
            }

            if (count === 0 || count > 4) {
                expect(apples).toBe(`${count} jablek`);
                continue;
            }

            expect(apples).toBe(`${count} jablka`);
        }
    });

    it("uses en plural rules", () => {
        for (let count = 0; count <= 3; count++) {
            const apples = translate("count.apple", "en", translations, { count });

            if (count === 1) {
                expect(apples).toBe("1 apple");
                continue;
            }

            expect(apples).toBe(`${count} apples`);
        }
    });

    it("uses context", () => {
        expect(translate("context.friend", "en", translations)).toBe("A friend");
        expect(translate("context.friend", "en", translations, { context: "male" })).toBe("A boyfriend");
        expect(translate("context.friend", "en", translations, { context: "female" })).toBe("A girlfriend");
    });

    it("uses context with count", () => {
        expect(translate("context.friend", "en", translations, { context: "male", count: 1 })).toBe("A boyfriend");
        expect(translate("context.friend", "en", translations, { context: "female", count: 1 })).toBe("A girlfriend");

        const count = 5;
        expect(translate("context.friend", "en", translations, { context: "male", count })).toBe(
            count + " boyfriends"
        );
        expect(translate("context.friend", "en", translations, { context: "female", count })).toBe(
            count + " girlfriends"
        );
    });

    it("uses capitalize", () => {
        expect(translate("capitalize.apple", "en", translations, { color: "red", capitalize: true })).toBe("Red apple");
        expect(translate("capitalize.pear", "en", translations, { capitalize: true })).toBe("Pear");
    })
});
