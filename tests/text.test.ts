import { getTranslationText, LangCode } from "../src";
// @ts-ignore
import { expectFromEntries, expectFromWrong, sampleText } from "./testUtils";

type Entry = [LangCode<"source">, LangCode<"target">, string];

const entries: Entry[] = [
    ["es", "en", "hola"],
    ["es", "en", "convención"],
    ["auto", "en", "prueba"],
    ["auto", "es", "win"],
    ["en", "es", "poato"],
    ["zh", "en", "早安"],
    ["ca", "es", sampleText.large]
];

it("returns translated text correctly", () => (
    expectFromEntries(entries, getTranslationText, trans => {
        expect(trans).not.toBeNull();
    })
));

it("returns null on wrong params", () => (
    expectFromWrong(getTranslationText)
));

it("returns null on huge text", () => (
    getTranslationText("ca", "es", sampleText.huge)
        .then(trans => expect(trans).toBeNull())
));
