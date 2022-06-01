import { languages, exceptions, mappings } from "./languages.json";

const isKeyOf = <T extends object>(obj: T) => (key: keyof any): key is keyof T => key in obj;

export const LanguageType = {
    SOURCE: "source",
    TARGET: "target"
} as const;

export type LangCode = keyof typeof languages;
export type LangType = typeof LanguageType[keyof typeof LanguageType];

const checkAndChangeCode = (
    blacklists: typeof mappings | typeof exceptions,
    langType: LangType,
    langCode: LangCode
): LangCode => {
    const finalBlacklist = blacklists[langType];
    return isKeyOf(finalBlacklist)(langCode)
        ? finalBlacklist[langCode]
        : langCode;
};
export const mapGoogleCode = (langType: LangType, langCode: LangCode) => checkAndChangeCode(mappings, langType, langCode);
export const replaceExceptedCode = (langType: LangType, langCode: LangCode) => checkAndChangeCode(exceptions, langType, langCode);

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
