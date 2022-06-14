import { mapGoogleCode, LangCode } from "./utils/language";
import request, { Endpoint } from "./utils/request";
import * as parse from "./utils/parse";
import { Boilerplate, Data } from "./utils/types";
import { TranslationInfo } from "./utils/interfaces";

/**
 * Retrieves the full translation information given a pair of languages and a query
 * @param source - The code of the language to translate from
 * @param target - The code of the language to translate to
 * @param query - The text to be translated
 * @returns An element with all the information, as defined in {@link TranslationInfo}
 */
export const getTranslationInfo = async (
    source: LangCode<"source">,
    target: LangCode<"target">,
    query: string
): Promise<TranslationInfo | null> => {
    const parsedSource = mapGoogleCode(source);
    const parsedTarget = mapGoogleCode(target);

    const reqData = JSON.stringify([[query, parsedSource, parsedTarget, true], [null]]);
    const reqBoilerplate = JSON.stringify([[["MkEWBc", reqData, null, "generic"]]]);
    const body = "f.req=" + encodeURIComponent(reqBoilerplate);

    return request(Endpoint.INFO)
        .with({ body })
        .doing(({ data }) => {
            const resBoilerplate: Boilerplate = JSON.parse(data?.split("\n")?.[3]);
            const resData: Data = JSON.parse(resBoilerplate?.[0]?.[2]);
            if (!resData)
                return;

            return parse.undefinedFields({
                detectedSource: source === "auto"
                    ? parse.detected(resData)
                    : undefined,
                typo: parse.typo(resData),
                pronunciation: {
                    query: parse.pronunciation.query(resData),
                    translation: parse.pronunciation.translation(resData)
                },
                definitions: parse.list.definitions(resData),
                examples: parse.list.examples(resData),
                similar: parse.list.similar(resData),
                extraTranslations: parse.list.translations(resData),
            });
        });
};
