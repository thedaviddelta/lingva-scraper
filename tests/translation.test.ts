import { getTranslation } from "../src";

it("returns translation info correctly", async () => (
    Promise.all([
        getTranslation("auto", "es", "win").then(console.log),
        getTranslation("auto", "zh", "hello").then(console.log),
        getTranslation("zh", "en", "早安").then(console.log)
    ])
));
