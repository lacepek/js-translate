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
            apple_one_ordinal: "{{count}}st apple",
            apple_two_ordinal: "{{count}}nd apple",
            apple_few_ordinal: "{{count}}rd apple",
            apple_other_ordinal: "{{count}}th apple",
        },
        context: {
            friend: "A friend",
            friend_male: "A boyfriend",
            friend_female: "A girlfriend",
            friend_male_one: "A boyfriend",
            friend_female_one: "A girlfriend",
            friend_male_other: "{{count}} boyfriends",
            friend_female_other: "{{count}} girlfriends",
            doctor: "Doctor",
            doctor_adj: "doctors",
            round: "round",
        },
        capitalize: {
            apple: "{{color}} apple",
            pear: "pear",
        },
        dog: "Dog"
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
            apple_other_ordinal: "{{count}}. jablko",
            pear: "Hruška",
        },
        capitalize: {
            apple: "{{color}} jablko",
            pear: "hruška",
        },
        context: {
            doctor: "Doktor",
            doctor_female: "Doktorka",
            doctor_adj: "doktorský",
            doctor_adj_neutral: "doktorské",
            round_adj_male: "kulatý",
            round_adj_female: "kulatá",
        },
        pes: "Pes"
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
        expect(translate("context.friend", "en", translations, {}, { context: "male" })).toBe("A boyfriend");
        expect(translate("context.friend", "en", translations, {}, { context: "female" })).toBe("A girlfriend");
    });

    it("uses context with count", () => {
        expect(translate("context.friend", "en", translations, { count: 1 }, { context: "male" })).toBe("A boyfriend");
        expect(translate("context.friend", "en", translations, { count: 1 }, { context: "female" })).toBe(
            "A girlfriend"
        );

        const count = 5;
        expect(translate("context.friend", "en", translations, { count }, { context: "male" })).toBe(
            count + " boyfriends"
        );
        expect(translate("context.friend", "en", translations, { count }, { context: "female" })).toBe(
            count + " girlfriends"
        );
    });

    it("uses capitalize", () => {
        expect(translate("capitalize.apple", "en", translations, { color: "red" }, { capitalize: true })).toBe(
            "Red apple"
        );
        expect(translate("capitalize.pear", "en", translations, {}, { capitalize: true })).toBe("Pear");
    });

    it("falls back when context or count isn't found", () => {
        expect(translate("context.doctor", "en", translations)).toBe("Doctor");
        expect(translate("context.doctor", "cs", translations)).toBe("Doktor");

        expect(translate("context.doctor", "en", translations, {}, { context: "male" })).toBe("Doctor");
        expect(translate("context.doctor", "en", translations, {}, { context: "female" })).toBe("Doctor");

        expect(translate("context.doctor", "cs", translations, {}, { context: "male" })).toBe("Doktor");
        expect(translate("context.doctor", "cs", translations, {}, { context: "female" })).toBe("Doktorka");

        expect(translate("count.pear", "cs", translations, { count: 2 }, { context: "fruit" })).toBe("Hruška");
        expect(translate("count.pear", "cs", translations, { count: 2 })).toBe("Hruška");
        expect(translate("count.pear", "cs", translations, {})).toBe("Hruška");
    });

    it("chains multiple contexts together and falls back on previous context if not found", () => {
        expect(translate("context.round", "cs", translations, {}, { context: ["adj", "male"] })).toBe("kulatý");
        expect(translate("context.round", "cs", translations, {}, { context: ["adj", "female"] })).toBe("kulatá");

        expect(translate("context.round", "en", translations, {}, { context: ["adj", "male"] })).toBe("round");
        expect(translate("context.round", "en", translations, {}, { context: ["adj", "female"] })).toBe("round");

        expect(translate("context.doctor", "cs", translations, {}, { context: ["adj", "neutral"] })).toBe("doktorské");
        expect(translate("context.doctor", "cs", translations, {}, { context: ["adj", "female"] })).toBe("doktorský");

        expect(translate("context.doctor", "en", translations, {}, { context: ["adj", "neutral"] })).toBe("doctors");
        expect(translate("context.doctor", "en", translations, {}, { context: ["adj", "female"] })).toBe("doctors");
    });

    it("uses ordinal plural rules", () => {
        for (let count = 0; count <= 6; count++) {
            const apples = translate("count.apple", "cs", translations, { count }, { ordinal: true });

            expect(apples).toBe(`${count}. jablko`);
        }

        for (let count = 0; count <= 6; count++) {
            const apples = translate("count.apple", "en", translations, { count }, { ordinal: true });

            if (count === 1) {
                expect(apples).toBe(`${count}st apple`);
            } else if (count === 2) {
                expect(apples).toBe(`${count}nd apple`);
            } else if (count === 3) {
                expect(apples).toBe(`${count}rd apple`);
            } else {
                expect(apples).toBe(`${count}th apple`);
            }
        }
    });

    it("uses fallback locale", () => {
        expect(translate("dog", "cs", translations, {}, { fallbackLocale: "en" })).toBe("Dog");
        expect(translate("pes", "en", translations, {}, { fallbackLocale: "cs" })).toBe("Pes");
    });

    it("uses fallback value", () => {
        expect(translate("dog", "cs", translations, {}, { fallbackValue: "Not found" })).toBe("Not found");
        expect(translate("pes", "en", translations, {}, { fallbackValue: "Pes not found" })).toBe("Pes not found");
    });
});
