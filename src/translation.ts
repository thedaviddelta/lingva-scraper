import { mapGoogleCode, LangCode } from "./utils/language";
import request, { Endpoint } from "./utils/request";
import * as parse from "./utils/parse";
import { Boilerplate, Info } from "./utils/types";
import { Translation } from "./utils/interfaces";

export const getTranslation = (
    source: LangCode<"source">,
    target: LangCode<"target">,
    query: string
): Promise<Translation | null> => {
    const parsedSource = mapGoogleCode(source);
    const parsedTarget = mapGoogleCode(target);

    const reqInfo = JSON.stringify([[query, parsedSource, parsedTarget, true], [null]]);
    const reqBoilerplate = JSON.stringify([[["MkEWBc", reqInfo, null, "generic"]]]);
    const body = "f.req=" + encodeURIComponent(reqBoilerplate);

    return request(Endpoint.TRANSLATION)
        .with({ body })
        .doing(({ data }) => {
            const boilerplate: Boilerplate = JSON.parse(data?.split("\n")?.[3]);
            const info: Info = JSON.parse(boilerplate?.[0]?.[2]);
            if (!info)
                return;

            const translation = parse.translation(info);
            if (!translation)
                return;

            return parse.undefinedFields({
                translation,
                detectedSource: parse.detected(info),
                pronunciation: {
                    query: parse.pronunciation.query(info),
                    translation: parse.pronunciation.translation(info)
                },
                definitions: parse.list.definitions(info),
                examples: parse.list.examples(info),
                similar: parse.list.similar(info),
                extraTranslations: parse.list.translations(info),
            });
        });
};
