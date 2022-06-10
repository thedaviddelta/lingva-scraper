import { getTranslationInfo, LangCode } from "../src";
// @ts-ignore
import { expectFromEntries, expectFromWrong, expectTruthyValues, sampleText } from "./testUtils";

type Entry = [LangCode<"source">, LangCode<"target">, string];

const entries: Entry[] = [
    ["es", "en", "hola"],
    ["es", "en", "convención"],
    ["auto", "en", "prueba"],
    ["auto", "es", "win"],
    ["zh", "en", "早安"],
    ["ca", "es", sampleText.large]
];

it("returns translation info correctly", () => (
    expectFromEntries(entries, getTranslationInfo, info => {
        expect(info).not.toBeNull();
        info && expectTruthyValues(info);
    })
));

it("returns null on wrong params", () => (
    expectFromWrong(getTranslationInfo)
));

it("returns null on huge text", () => (
    getTranslationInfo("ca", "es", sampleText.huge)
        .then(info => expect(info).toBeNull())
));
