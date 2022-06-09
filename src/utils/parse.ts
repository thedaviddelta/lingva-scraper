import { Info } from "./types";
import { mapLingvaCode } from "./language";
import { Translation } from "./interfaces";

export const detected = ([source, target, detected, extra]: Info): Translation["detectedSource"] => {
    const code = detected ?? source?.[2] ?? target?.[3] ?? extra?.[8] ?? extra?.[5]?.[0]?.[0]?.[3];
    return code ? mapLingvaCode<"source">(code) : undefined;
};

export const translation = ([, target]: Info): Translation["translation"] | undefined => (
    target?.[0]?.[0]?.[5]?.[0]?.[0] ?? target?.[0]?.[0]?.[5]?.[0]?.[4]?.[0]?.[0]
);

export const pronunciation = {
    query: ([source]: Info): Translation["pronunciation"]["query"] => (
        source?.[0] ?? undefined
    ),
    translation: ([, target]: Info): Translation["pronunciation"]["translation"] => (
        target?.[0]?.[0]?.[1] ?? undefined
    )
};

export const list = {
    definitions: ({ 3: extra }: Info): Translation["definitions"] => (
        extra?.[1]?.[0]?.map(([type, defList]) => ({
            type,
            list: defList?.map(({ 0: definition, 1: example, 4: fieldWrapper, 5: synList }) => ({
                definition,
                example,
                field: fieldWrapper?.[0]?.[0],
                synonyms: synList
                    ?.flatMap(synItem => synItem?.[0]?.map(([item]) => item))
                    ?.filter((item): item is string => !!item) ?? []
            })) ?? []
        })) ?? []
    ),
    examples: ({ 3: extra }: Info): Translation["examples"] => (
        extra?.[2]?.[0]?.map(([, item]) => item) ?? []
    ),
    similar: ({ 3: extra }: Info): Translation["similar"] => (
        extra?.[3]?.[0] ?? []
    ),
    translations: ({ 3: extra }: Info): Translation["extraTranslations"] => (
        extra?.[5]?.[0]?.map(([type, transList]) => ({
            type,
            list: transList?.map(([word, article, meanings, frequency]) => ({
                word,
                article: article ?? undefined,
                meanings,
                frequency: 4 - frequency // turn it around
            })) ?? []
        })) ?? []
    ),
};

type GenericObject<T> = { [k: string]: T } | Array<T>;

const isObject = (value: unknown): value is GenericObject<object | string | number> => typeof value === "object";

export const undefinedFields = <T extends GenericObject<V | undefined>, V>(obj: T): T => {
    if (Array.isArray(obj))
        return obj.filter((item): item is V => !!item).map(item => isObject(item) ? undefinedFields(item) : item) as T;

    const entries = Object.entries(obj)
        .filter((entry): entry is [string, V] => !!entry[1])
        .map(([key, value]) => [key, isObject(value) ? undefinedFields(value) : value]);
    return Object.fromEntries(entries);
};
