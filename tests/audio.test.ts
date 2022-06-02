import { getAudio, LangCode } from "../src";

const queries: [LangCode<"target">, string][] = [
    ["es", "hola"],
    ["ca", "gerd"],
    ["en", "impression"],
    ["zh", "早安"],
    ["zh_HANT", "早安"]
];

it("returns audio buffer correctly", async () => (
    Promise.all(queries.map((query) => getAudio(...query)))
        .then(results => results.forEach(audio => {
            expect(audio).not.toBeNull();
            audio?.forEach(int => expect(int).toEqual(expect.any(Number)));
        }))
));

it("returns null on wrong language", async () => (
    // @ts-ignore
    getAudio("wrong", "impression")
        .then(audio => expect(audio).toBeNull())
));
