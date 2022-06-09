import { getTranslation, LangCode } from "../src";

const entries: [LangCode<"source">, LangCode<"target">, string][] = [
    ["es", "en", "hola"],
    ["es", "en", "convención"],
    ["auto", "en", "prueba"],
    ["auto", "es", "win"],
    ["zh", "en", "早安"]
];

export const expectNoUndefined = (obj: object): void => {
    const list = Array.isArray(obj) ? obj : Object.values(obj);
    list.forEach(value =>
        typeof value === "object"
            ? expectNoUndefined(value)
            : expect(value).toBeTruthy()
    );
};

it("returns translation info correctly", async () => (
    Promise.all(entries.map((entry) => getTranslation(...entry)))
        .then(results => results.forEach(trans => {
            expect(trans).not.toBeNull();
            trans && expectNoUndefined(trans);
        }))
));

it("returns null on wrong params", async () => (
    // @ts-ignore
    getTranslation("", "", "")
        .then(trans => expect(trans).toBeNull())
));
