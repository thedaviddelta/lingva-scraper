import { getAudio, LangCode } from "../src";
// @ts-ignore
import { expectFromEntries, expectFromWrong, sampleText } from "./testUtils";

type Entry = [LangCode<"target">, string];

const entries: Entry[] = [
    ["es", "hola"],
    ["ca", "gerd"],
    ["en", "impression"],
    ["zh", "早安"],
    ["zh_HANT", "早安"],
    ["en", "poato"],
    ["ca", sampleText.large],
    ["ca", sampleText.huge]
];

it("returns audio buffer correctly", () => (
    expectFromEntries(entries, getAudio, audio => {
        expect(audio).not.toBeNull();
        audio?.forEach(int => expect(int).toEqual(expect.any(Number)));
    })
));

it("returns null on wrong params", () => (
    expectFromWrong(getAudio)
));
