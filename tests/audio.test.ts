import { getAudio, LangCode } from "../src";

const entries: [LangCode<"target">, string][] = [
    ["es", "hola"],
    ["ca", "gerd"],
    ["en", "impression"],
    ["zh", "早安"],
    ["zh_HANT", "早安"]
];

it("returns audio buffer correctly", async () => (
    Promise.all(entries.map((entry) => getAudio(...entry)))
        .then(results => results.forEach(audio => {
            expect(audio).not.toBeNull();
            audio?.forEach(int => expect(int).toEqual(expect.any(Number)));
        }))
));

it("returns null on wrong params", async () => (
    // @ts-ignore
    getAudio("", "")
        .then(audio => expect(audio).toBeNull())
));
