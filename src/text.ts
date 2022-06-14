import cheerio from "cheerio";
import { mapGoogleCode, LangCode } from "./utils/language";
import request, { Endpoint } from "./utils/request";

/**
 * Retrieves the translation given a pair of languages and a query
 * @param source - The code of the language to translate from
 * @param target - The code of the language to translate to
 * @param query - The text to be translated
 * @returns A single {@link string} with the translated text
 */
export const getTranslationText = async (
    source: LangCode<"source">,
    target: LangCode<"target">,
    query: string
): Promise<string | null> => {
    const parsedSource = mapGoogleCode(source);
    const parsedTarget = mapGoogleCode(target);

    const encodedQuery = encodeURIComponent(query);

    if (encodedQuery.length > 7500)
        return null;

    return request(Endpoint.TEXT)
        .with({ source: parsedSource, target: parsedTarget, query: encodedQuery })
        .doing(({ data }) => {
            if (!data)
                return;

            const translation = cheerio.load(data)(".result-container").text()?.trim();
            return translation && !translation.includes("#af-error-page")
                ? translation
                : null;
        });
};
