import { EOL } from "node:os";
import tirant from "./tirant.json";

export const expectFromEntries = <E extends any[], R>(
    entries: E[],
    runCb: (...params: E) => Promise<R>,
    expectCb: (result: R) => any
): Promise<void> => (
    Promise.all(entries.map(entry => runCb(...entry)))
        .then(results => results.forEach(expectCb))
);

export const expectFromWrong = async <E extends any[]>(
    callback: (...params: E) => Promise<any>
): Promise<void> => (
    callback(...Array(10).fill("") as E)
        .then(result => expect(result).toBeNull())
);

export const expectTruthyValues = (obj: object): void => {
    const list = Array.isArray(obj) ? obj : Object.values(obj);
    list.forEach(value =>
        typeof value === "object"
            ? expectTruthyValues(value)
            : expect(value).toBeTruthy()
    );
};

export const sampleText = {
    large: tirant.prologue,
    huge: tirant.chapters.join(EOL)
};
