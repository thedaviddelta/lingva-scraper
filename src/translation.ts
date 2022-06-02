import { mapGoogleCode, mapLingvaCode, LangCode } from "./utils/language";
import request, { Endpoint } from "./utils/request";
import { Boilerplate, Info } from "./utils/types";

const parseTranslation = {
    detected: ([source, target, detected, extra]: Info) => {
        const code = detected ?? source?.[2] ?? target?.[3] ?? extra?.[8] ?? extra?.[5]?.[0]?.[0]?.[3];
        return code ? mapLingvaCode<"source">(code) : undefined;
    }
};

export const getTranslation = (source: LangCode<"source">, target: LangCode<"target">, query: string) => {
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
                return null;
            const [infoSource, infoTarget, _, infoExtra] = info;

            const queryPronunciation = infoSource?.[0];
            const detected = parseTranslation.detected(info);
            const translation = infoTarget?.[0]?.[0]?.[5]?.[0]?.[0];
            const translationPronunciation = infoTarget?.[0]?.[0]?.[1];

            return { queryPronunciation, detected, translation, translationPronunciation };
        });
};
