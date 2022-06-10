import { getSimpleTranslation, LangCode } from "../src";
// @ts-ignore
import { expectFromEntries, expectFromWrong, sampleText } from "./testUtils";

type Entry = [LangCode<"source">, LangCode<"target">, string];

const entries: Entry[] = [
    ["es", "en", "hola"],
    ["es", "en", "convención"],
    ["auto", "en", "prueba"],
    ["auto", "es", "win"],
    ["zh", "en", "早安"],
    ["ca", "es", sampleText.large]
];

it("returns translated text correctly", () => (
    expectFromEntries(entries, getSimpleTranslation, trans => {
        expect(trans).not.toBeNull();
    })
));

it("returns null on wrong params", () => (
    expectFromWrong(getSimpleTranslation)
));

it("returns null on huge text", () => (
    getSimpleTranslation("ca", "es", sampleText.huge)
        .then(trans => expect(trans).toBeNull())
));
