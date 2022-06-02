import { languages, exceptions, mappings } from "./languages.json";

export const LanguageType = {
    SOURCE: "source",
    TARGET: "target"
} as const;

type LangType = typeof LanguageType[keyof typeof LanguageType];

export type LangCode<T extends LangType | void = void> =
    T extends LangType
        ? Exclude<keyof typeof languages, keyof typeof exceptions[T]>
        : keyof typeof languages;

export type LangCodeGoogle<T extends LangCode | LangType = LangCode> =
    T extends LangType
        ? Exclude<LangCode<T>, keyof typeof mappings["request"]> | keyof typeof mappings["response"]
        : Exclude<T, keyof typeof mappings["request"]> | keyof typeof mappings["response"];

const isKeyOf = <T extends object>(obj: T) => (key: keyof any): key is keyof T => key in obj;

export const replaceExceptedCode = <T extends LangType>(langType: T, langCode: LangCode) => {
    const langExceptions = exceptions[langType];
    const finalCode = isKeyOf(langExceptions)(langCode)
        ? langExceptions[langCode]
        : langCode;
    return finalCode as LangCode<T>;
};

export const mapGoogleCode = <T extends LangCode>(langCode: T) => {
    const reqMappings = mappings["request"];
    const finalCode = isKeyOf(reqMappings)(langCode)
        ? reqMappings[langCode]
        : langCode;
    return finalCode as LangCodeGoogle<T>;
};

export const mapLingvaCode = <T extends LangType>(langCode: LangCodeGoogle<T>) => {
    const resMappings = mappings["response"];
    const finalCode = isKeyOf(resMappings)(langCode)
        ? resMappings[langCode]
        : langCode;
    return finalCode as LangCode<T>;
};

const filteredLanguages = (type: LangType) => {
    const entries = Object.entries(languages) as [LangCode, string][];

    const filteredEntries = entries.filter(([code]) => (
        !Object.keys(exceptions[type]).includes(code)
    ));

    return Object.fromEntries(filteredEntries) as typeof languages;
}

export const languageList = {
    all: languages,
    source: filteredLanguages(LanguageType.SOURCE),
    target: filteredLanguages(LanguageType.TARGET),
};
