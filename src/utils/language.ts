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

/**
 * Checks if the given code is a valid language code and infers its type correctly
 * @param code - The hypothetical code to check
 * @param [langType] - The type of language to check on
 * @returns A boolean showing whether the code is valid or not
 */
export const isValidCode = <T extends LangType>(code: string | null | undefined, langType?: T): code is LangCode<T> => (
    !!code && isKeyOf(languageList[langType ?? "all"])(code)
);

/**
 * Changes invalid languages for a certain language type with the proper replacement
 * @param langType - The type of language to check on
 * @param langCode - A *Lingva* language code
 * @returns A proper *Lingva* code for that language type
 */
export const replaceExceptedCode = <T extends LangType>(langType: T, langCode: LangCode) => {
    const langExceptions = exceptions[langType];
    const finalCode = isKeyOf(langExceptions)(langCode)
        ? langExceptions[langCode]
        : langCode;
    return finalCode as LangCode<T>;
};

/**
 * Maps a *Lingva* language code to a *Google* one
 * @param langCode - A *Lingva* language code
 * @returns The proper *Google* code for that language
 */
export const mapGoogleCode = <T extends LangCode>(langCode: T) => {
    const reqMappings = mappings["request"];
    const finalCode = isKeyOf(reqMappings)(langCode)
        ? reqMappings[langCode]
        : langCode;
    return finalCode as LangCodeGoogle<T>;
};

/**
 * Maps a *Google* language code to a *Lingva* one
 * @param langCode - A *Google* language code
 * @returns The proper *Lingva* code for that language
 */
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
